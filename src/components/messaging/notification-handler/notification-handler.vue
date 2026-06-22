<template>
	<floating-details
		v-bind="{ ...$attrs, align, includeIcon: false }"
		summary-classes="button--muted relative p-3"
		class="w-min text-sm"
		data-component="notification-handler"
		data-test="notification-handler"
	>
		<template #summary>
			<icon-bell class="mx-[-0.25em] my-[0.25em]" />

			<span class="sr-only">
				<slot name="show-notifications-label" v-bind="{ unreadCount: unreadNotificationCount }">
					{{ triggerLabel }}
				</slot>
			</span>

			<div
				v-if="haveUnreadNotifications"
				aria-hidden="true"
				class="bg-primary text-primary-foreground absolute inset-e-0 top-0 -me-2 -mt-2 flex h-5 min-w-5 items-center justify-center rounded-full p-1 text-xs leading-none"
				data-test="notification-handler-badge"
			>
				{{ unreadNotificationCount }}
			</div>
		</template>

		<define-template v-slot="{ notification }">
			<slot
				:name="getNotificationSlotName(notification)"
				v-bind="{ notification, markNotificationRead: () => markNotificationRead(notification.id) }"
			>
				<component
					:is="getNotificationComponent(notification)"
					v-bind="{ notification, locale, dateFormat }"
					class="animate-fade-in delay"
					@notification:read="markNotificationRead"
				>
					<template #view-more-label>
						<slot name="view-more-label" />
					</template>

					<template #actions="slotParameters">
						<slot name="notification-actions" v-bind="slotParameters" />
					</template>
				</component>
			</slot>
		</define-template>

		<loading-indicator v-if="props.loading" v-bind="{ large: true }">
			<slot name="loading-label">Loading notifications</slot>
		</loading-indicator>

		<div v-if="!props.loading">
			<div v-if="haveNotificationsToDisplay" class="flex flex-col gap-4">
				<div
					v-if="canMarkAllNotificationsRead || allowReload"
					class="flex items-center justify-between text-xs"
					data-test="notification-handler-toolbar"
				>
					<ui-button
						v-if="allowReload"
						class="button--muted"
						icon-start="icon-reload"
						data-test="notification-handler-reload"
						@click="reloadNotifications"
					>
						<slot name="reload-label">Reload notifications</slot>
					</ui-button>

					<ui-button
						v-if="canMarkAllNotificationsRead"
						class="button--muted"
						icon-start="icon-check"
						data-test="notification-handler-mark-all-read"
						@click="markAllNotificationsRead"
					>
						<slot name="mark-all-read-label">Mark all notifications read</slot>
					</ui-button>
				</div>

				<div
					class="flex flex-col gap-4"
					data-part="list"
					data-test="notification-handler-notifications"
				>
					<template v-for="notification in pinnedNotifications" :key="notification.id">
						<slot name="notification-pinned-template" v-bind="{ notification }">
							<reuse-template v-bind="{ notification }" />
						</slot>
					</template>

					<hr v-if="havePinnedNotifications && haveUnpinnedNotifications" class="border-border" />

					<template v-for="notification in unpinnedNotifications" :key="notification.id">
						<reuse-template v-bind="{ notification }" />
					</template>
				</div>
			</div>

			<div v-else class="flex flex-col items-center gap-2 py-4">
				<icon-bell
					class="animate-fade-in delay bg-primary-100 text-primary-800 size-10 rounded-full p-3"
				/>

				<span class="animate-fade-in delay">
					<slot name="no-notifications-label">No new notifications</slot>
				</span>
			</div>
		</div>
	</floating-details>

	<span
		role="status"
		aria-live="polite"
		aria-relevant="additions"
		class="sr-only"
		data-test="notification-handler-live-region"
	>
		{{ announcement }}
	</span>
</template>

<script setup>
import { arrayLength, isNonEmptyArray, pluck } from "@lewishowles/helpers/array";
import { computed, ref, watch } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import { getPathValue, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNumber } from "@lewishowles/helpers/number";
import { useNotifications } from "@/composables/use-notifications/use-notifications.js";

const props = defineProps({
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
	 * Whether to display the "Mark all read" button. Deactivating means the
	 * user will be required to mark notifications as read individually.
	 */
	allowMarkAllRead: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to display the "Reload" button. Deactivating means new
	 * notifications will only be shown when something triggers a re-load in the
	 * parent component.
	 */
	allowReload: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether the notifications are currently loading (or re-loading). This
	 * will show a loading indicator to the user to provide feedback.
	 */
	loading: {
		type: Boolean,
		default: false,
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

const emit = defineEmits(["notifications:reload"]);

defineOptions({ inheritAttrs: false });

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

import NotificationDanger from "./fragments/notification-danger/notification-danger.vue";
import NotificationInfo from "./fragments/notification-info/notification-info.vue";
import NotificationPinned from "./fragments/notification-pinned/notification-pinned.vue";
import NotificationRead from "./fragments/notification-read/notification-read.vue";
import NotificationWarning from "./fragments/notification-warning/notification-warning.vue";

const {
	markAllRead: registryMarkAllRead,
	markRead: registryMarkRead,
	notifications,
} = useNotifications();

// The current screen reader announcement for the live region.
const announcement = ref("");

// The sr-only label for the trigger button, including the unread count when
// there are unread notifications.
const triggerLabel = computed(() => {
	if (unreadNotificationCount.value > 0) {
		return `Show notifications, ${unreadNotificationCount.value} unread`;
	}

	return "Show notifications";
});

// The notifications to display, filtered and sorted for the current view. The
// composable is the source of truth for notification state; this computed
// applies display-only concerns (read visibility, date ordering, count cap).
const internalNotifications = computed(() => {
	let notifs = [...notifications.value];

	if (props.hideNotificationsWhenRead) {
		notifs = notifs.filter((n) => getPathValue(n, "read") !== true);
	}

	notifs = sortNotificationsByDate(notifs);
	notifs = limitReadNotifications(notifs);

	return notifs;
});

// Whether we have any notifications to display.
const haveNotificationsToDisplay = computed(() => isNonEmptyArray(internalNotifications.value));

// A list of all notifications that are not marked as "read".
const unreadNotifications = computed(() => {
	if (!haveNotificationsToDisplay.value) {
		return [];
	}

	return internalNotifications.value.filter(
		(notification) => getPathValue(notification, "read") !== true,
	);
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
const canMarkAllNotificationsRead = computed(
	() => props.allowMarkAllRead && haveUnreadNotifications.value,
);

// Notifications that have been pinned, allowing us to display them separately.
const pinnedNotifications = computed(() =>
	internalNotifications.value.filter(
		(notification) => getPathValue(notification, "pinned") === true,
	),
);

// Whether any pinned notifications exist.
const havePinnedNotifications = computed(() => isNonEmptyArray(pinnedNotifications.value));

// Notifications that have not been pinned.
const unpinnedNotifications = computed(() =>
	internalNotifications.value.filter(
		(notification) => getPathValue(notification, "pinned") !== true,
	),
);

// Whether any unpinned notifications exist.
const haveUnpinnedNotifications = computed(() => isNonEmptyArray(unpinnedNotifications.value));

// Announce new unread notifications to screen readers when the count increases.
watch(unreadNotificationCount, (newCount, oldCount) => {
	if (newCount > oldCount) {
		announce(`${newCount} unread notification${newCount === 1 ? "" : "s"}`);
	}
});

/**
 * Sort the given notifications by their `date` property, allowing one or both
 * notifications to be missing a date property. Notifications with dates appear
 * before those without.
 *
 * @param  {object[]}  notifications
 *     The notifications to sort.
 */
function sortNotificationsByDate(notifications) {
	return notifications.sort((a, b) => {
		const dateA = getPathValue(a, "date", null);
		const dateB = getPathValue(b, "date", null);

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
 * @param  {object[]}  notifications
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
		if (getPathValue(notification, "read") !== true) {
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
 * Set the live region announcement, using a clear-then-set pattern so the same
 * message can be re-announced if needed.
 *
 * @param  {string}  message
 */
function announce(message) {
	announcement.value = "";

	setTimeout(() => {
		announcement.value = message;
	}, 100);
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
	if (getPathValue(notification, "read") === true) {
		return "notification-read-template";
	}

	if (getPathValue(notification, "type") === "danger") {
		return "notification-danger-template";
	}

	if (getPathValue(notification, "type") === "warning") {
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
	if (getPathValue(notification, "pinned") === true) {
		return NotificationPinned;
	}

	if (getPathValue(notification, "read") === true) {
		return NotificationRead;
	}

	if (getPathValue(notification, "type") === "danger") {
		return NotificationDanger;
	}

	if (getPathValue(notification, "type") === "warning") {
		return NotificationWarning;
	}

	return NotificationInfo;
}

/**
 * Mark a single notification as read.
 *
 * @param  {string}  notificationId
 *     The ID of the notification to mark as read.
 */
function markNotificationRead(notificationId) {
	registryMarkRead(notificationId);
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
 * Mark all unread notifications as read, excluding those that are pinned.
 */
function markAllNotificationsRead() {
	if (!haveUnreadNotifications.value) {
		return;
	}

	registryMarkAllRead();
	announce("All notifications marked as read");
}

defineExpose({
	notifications: internalNotifications,
	unreadCount: unreadNotificationCount,
	markAllRead: markAllNotificationsRead,
});
</script>
