<template>
	<summary-details v-bind="{ includeIcon: false, floating: true, closeWithClickOutside: true, align, summaryClasses: 'button--muted relative p-3', detailsClasses: 'mt-3 w-lg rounded-md border border-grey-200 bg-white p-4 shadow' }" class="w-min text-sm" data-test="notification-handler">
		<template #summary>
			<icon-bell />

			<span class="sr-only">
				<slot name="show-notifications-label">
					Show notifications
				</slot>
			</span>

			<div v-if="haveUnreadNotifications" class="absolute end-0 top-0 -me-2 -mt-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-800 p-1 text-xs leading-none text-white" data-test="notification-handler-badge">
				{{ unreadNotificationCount }}
			</div>
		</template>

		<define-template v-slot="{ notification }">
			<slot :name="getNotificationSlotName(notification)" v-bind="{ notification, markNotificationRead: () => markNotificationRead(notification.id) }">
				<component :is="getNotificationComponent(notification)" v-bind="{ notification, locale, dateFormat }" class="animate-fade-in delay" @notification:read="markNotificationRead">
					<template #view-more-label>
						<slot name="view-more-label" />
					</template>

					<template #actions="slotParameters">
						<slot name="notification-actions" v-bind="slotParameters" />
					</template>
				</component>
			</slot>
		</define-template>

		<div v-if="haveNotificationsToDisplay" class="flex flex-col gap-4">
			<div v-if="canMarkAllNotificationsRead || allowReload" class="flex items-center justify-between text-xs" data-test="notification-handler-toolbar">
				<ui-button v-if="allowReload" class="button--muted" icon-start="icon-reload" data-test="notification-handler-reload" @click="reloadNotifications">
					<slot name="reload-label">
						Reload notifications
					</slot>
				</ui-button>

				<ui-button v-if="canMarkAllNotificationsRead" class="button--muted" icon-start="icon-check" data-test="notification-handler-mark-all-read" @click="markAllNotificationsRead">
					<slot name="mark-all-read-label">
						Mark all notifications read
					</slot>
				</ui-button>
			</div>

			<div class="flex flex-col gap-4" data-test="notification-handler-notifications">
				<template v-for="notification in pinnedNotifications" :key="notification.id">
					<slot name="notification-pinned-template" v-bind="{ notification}">
						<reuse-template v-bind="{ notification }" />
					</slot>
				</template>

				<template v-for="notification in unpinnedNotifications" :key="notification.id">
					<reuse-template v-bind="{ notification }" />
				</template>
			</div>
		</div>

		<div v-else class="flex flex-col items-center gap-2 py-4">
			<icon-bell class="animate-fade-in delay size-10 rounded-full bg-purple-100 p-3 text-purple-800" />

			<span class="animate-fade-in delay">
				<slot name="no-notifications-label">
					No new notifications
				</slot>
			</span>
		</div>
	</summary-details>
</template>

<script setup>
import { arrayLength, isNonEmptyArray, pluck } from "@lewishowles/helpers/array";
import { computed, ref } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber } from "@lewishowles/helpers/number";

const props = defineProps({
	/**
	 * The notifications to display to the user.
	 */
	notifications: {
		type: Array,
		default: null,
	},

	/**
	 * The locale to use when displaying dates. To reset to the user's
	 * locale settings, set the locale to undefined.
	 */
	locale: {
		type: String,
		default: undefined,
	},

	/**
	 * The date format to use in the display of the date. To reset to the user's
	 * locale settings, set the format to null.
	 */
	dateFormat: {
		type: Object,
		default: () => ({
			year: "numeric",
			day: "numeric",
			month: "long",
		}),
	},

	/**
	 * The alignment of the pop up notifications panel. Anything but "start"
	 * will be treated as "end".
	 */
	align: {
		type: String,
		default: "end",
	},

	/**
	 * Whether to display the “Mark all read” button. Deactivating means the
	 * user will be required to mark notifications as read individually.
	 */
	allowMarkAllRead: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to display the “Reload” button. Deactivating means new
	 * notifications will only be shown when something triggers a re-load in the
	 * parent component.
	 */
	allowReload: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to hide notifications when they are marked as read. If false,
	 * notifications will remain, but will appear less prominent. If true, any
	 * notifications that are already read when initialised will not be shown.
	 */
	hideNotificationsWhenRead: {
		type: Boolean,
		default: false,
	},

	/**
	 * The number of read notifications to display at maximum. Unread
	 * notifications are always shown.
	 */
	readNotificationCount: {
		type: Number,
		default: null,
	},
});

const emit = defineEmits(["notifications:read", "notifications:reload"]);

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

import NotificationDanger from "./fragments/notification-danger/notification-danger.vue";
import NotificationInfo from "./fragments/notification-info/notification-info.vue";
import NotificationPinned from "./fragments/notification-pinned/notification-pinned.vue";
import NotificationRead from "./fragments/notification-read/notification-read.vue";
import NotificationWarning from "./fragments/notification-warning/notification-warning.vue";

// Keep track of notifications that have been marked as read internally. This
// allows us to determine their style, and whether they should be visible, aside
// from the information provided when the notifications were originally
// initialised.
const notificationsMarkedAsRead = ref([]);

// Our internal notifications to display.
//
// - Remove invalid notifications (those that aren't objects and those that do
//   not contain a `message`)
// - Remove read notifications if `hideNotificationsWhenRead` is true
const internalNotifications = computed(() => {
	if (!isNonEmptyArray(props.notifications)) {
		return [];
	}

	let notifications = props.notifications
		.reduce((notifications, notification) => {
			if (!isNonEmptyObject(notification)) {
				return notifications;
			}

			// A notification must contain at least a message.
			if (!Object.hasOwn(notification, "message")) {
				return notifications;
			}

			// If set, hide any notifications that are marked as read.
			if (props.hideNotificationsWhenRead && (get(notification, "read") === true || hasNotificationBeenMarkedAsRead(notification.id))) {
				return notifications;
			}

			notifications.push(notification);

			return notifications;
		}, []);

	notifications = sortNotificationsByDate(notifications);
	notifications = limitReadNotifications(notifications);

	return notifications;
});

// Whether we have any notifications to display.
const haveNotificationsToDisplay = computed(() => isNonEmptyArray(internalNotifications.value));

// A list of all notifications that are not marked as "read".
const unreadNotifications = computed(() => {
	if (!haveNotificationsToDisplay.value) {
		return [];
	}

	return internalNotifications.value.filter(notification => get(notification, "read") !== true);
});

// How many unread notifications are present.
const unreadNotificationCount = computed(() => {
	if (!haveNotificationsToDisplay.value) {
		return 0;
	}

	return arrayLength(unreadNotifications.value);
});

// Whether there are any unread notifications to display.
const haveUnreadNotifications = computed(() => unreadNotificationCount.value > 0);
// Whether we're able to mark all notifications read, based on whether the
// option is enabled, and whether there are any notifications to mark.
const canMarkAllNotificationsRead = computed(() => props.allowMarkAllRead && haveUnreadNotifications.value);
// Notifications that have been pinned, allowing us to display them separately.
const pinnedNotifications = computed(() => internalNotifications.value.filter(notification => get(notification, "pinned") === true));
// Notifications that have not been pinned.
const unpinnedNotifications = computed(() => internalNotifications.value.filter(notification => get(notification, "pinned") !== true));

/**
 * Sort the given notifications by their `date` property, allowing one or both
 * notifications to be missing a date property. Notifications with dates appear
 * before those without.
 *
 * @param  {array}  notifications
 *     The notifications to sort.
 */
function sortNotificationsByDate(notifications) {
	return notifications.sort((a, b) => {
		const dateA = get(a, "date");
		const dateB = get(b, "date");

		if (dateA === null && dateB === null) {
			return 0;
		}

		if (dateA === null) {
			return 1;
		}

		if (dateB === null) {
			return -1;
		}

		return new Date(dateB) - new Date(dateA);
	});
}

/**
 * Limit the number of "read" notifications, based on the value of the
 * `readNotificationCount` prop.
 *
 * @param  {array}  notifications
 *     The notifications to limit.
 */
function limitReadNotifications(notifications) {
	if (!isNumber(props.readNotificationCount)) {
		return notifications;
	}

	if (!isNonEmptyArray(notifications)) {
		return [];
	}

	let readCount = 0;

	return notifications.filter((notification) => {
		if (get(notification, "read") !== true) {
			return true;
		}

		if (readCount < props.readNotificationCount) {
			readCount++;

			return true;
		}

		return false;
	});
}

/**
 * Get the appropriate slot name for the given notification type, based on its
 * information.
 *
 * We don't specifically return `notification-pinned-template` here, as we still
 * want to allow the regular template to override the appearance of pinned
 * templates, but a pinned template to also exist, which takes precedence.
 *
 * @param  {object}  notification
 *     The details of the notification to display.
 */
function getNotificationSlotName(notification) {
	if (get(notification, "read") === true || hasNotificationBeenMarkedAsRead(get(notification, "id"))) {
		return "notification-read-template";
	}

	if (get(notification, "type") === "danger") {
		return "notification-danger-template";
	}

	if (get(notification, "type") === "warning") {
		return "notification-warning-template";
	}

	return "notification-info-template";
}

/**
 * Get the appropriate component for the given notification type, based on its
 * information.
 *
 * @param  {object}  notification
 *     The details of the notification to display.
 */
function getNotificationComponent(notification) {
	if (get(notification, "pinned") === true) {
		return NotificationPinned;
	}

	if (get(notification, "read") === true || hasNotificationBeenMarkedAsRead(get(notification, "id"))) {
		return NotificationRead;
	}

	if (get(notification, "type") === "danger") {
		return NotificationDanger;
	}

	if (get(notification, "type") === "warning") {
		return NotificationWarning;
	}

	return NotificationInfo;
}

/**
 * Mark a single notification as read, using the same format as marking multiple
 * notifications read for simplicity.
 *
 * @param  {string}  notificationId
 *     The ID of the notification to mark as read.
 */
function markNotificationRead(notificationId) {
	if (!isNonEmptyString(notificationId)) {
		return;
	}

	emit("notifications:read", [notificationId]);

	notificationsMarkedAsRead.value.push(notificationId);
}

/**
 * Request that notifications are "reloaded", which is implemented by the parent
 * component based on how that information is loaded.
 */
function reloadNotifications() {
	if (!props.allowReload) {
		return;
	}

	emit("notifications:reload");
}

/**
 * Mark all unread notifications as read, excluding those that are pinned and
 * those that are already marked as read.
 */
function markAllNotificationsRead() {
	if (!haveUnreadNotifications.value) {
		return;
	}

	const relevantNotifications = unreadNotifications.value.filter(notification => get(notification, "pinned") !== true);
	const notificationIDs = pluck(relevantNotifications, "id");

	if (!isNonEmptyArray(notificationIDs)) {
		return;
	}

	emit("notifications:read", [notificationIDs]);

	notificationsMarkedAsRead.value.push(...notificationIDs);
}

/**
 * Determine whether a notification has been marked as read by the user since
 * the notifications have been displayed.
 *
 * @param  {string}  notificationId
 *     The ID of the notification to check.
 */
function hasNotificationBeenMarkedAsRead(notificationId) {
	if (!isNonEmptyString(notificationId)) {
		return false;
	}

	if (!isNonEmptyArray(notificationsMarkedAsRead.value)) {
		return false;
	}

	return notificationsMarkedAsRead.value.includes(notificationId);
}
</script>
