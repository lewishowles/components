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
				<component :is="getNotificationComponent(notification)" v-bind="{ notification, allowMarkRead: allowMarkReadForNotification(notification), locale, dateFormat }" @notification:read="markNotificationRead">
					<template #view-more-label>
						<slot name="view-more-label" />
					</template>

					<template #actions="slotParameters">
						<slot name="notification-actions" v-bind="slotParameters" />
					</template>
				</component>
			</slot>
		</define-template>

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
	</summary-details>
</template>

<script setup>
import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
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

const emit = defineEmits(["notifications:read"]);

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

import NotificationDanger from "./fragments/notification-danger/notification-danger.vue";
import NotificationInfo from "./fragments/notification-info/notification-info.vue";
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

// How many unread notifications are present.
const unreadNotificationCount = computed(() => {
	if (!isNonEmptyArray(internalNotifications.value)) {
		return 0;
	}

	return arrayLength(internalNotifications.value.filter(notification => get(notification, "read") !== true));
});

// Whether there are any unread notifications to display.
const haveUnreadNotifications = computed(() => unreadNotificationCount.value > 0);

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
	if (get(notification, "type") === "danger") {
		return NotificationDanger;
	}

	if (get(notification, "type") === "warning") {
		return NotificationWarning;
	}

	if (get(notification, "read") === true) {
		return NotificationRead;
	}

	return NotificationInfo;
}

/**
 * Whether the given notification should allow itself to be marked as read. For
 * example, notifications that are already read, or pinned notifications, cannot
 * be marked as read.
 *
 * @param  {object}  notification
 *     The details of the notification to display.
 */
function allowMarkReadForNotification(notification) {
	if (get(notification, "read") === true) {
		return false;
	}

	if (get(notification, "pinned") === true) {
		return false;
	}

	return true;
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
