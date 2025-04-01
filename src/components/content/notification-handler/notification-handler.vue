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

		<div class="flex flex-col gap-4" data-test="notification-handler-notifications">
			<template v-for="notification in internalNotifications" :key="notification.id">
				<slot :name="getNotificationSlotName(notification)" v-bind="{ notification }">
					<component :is="getNotificationComponent(notification)" v-bind="{ notification, locale, dateFormat }">
						<template #view-more-label>
							<slot name="view-more-label" />
						</template>
					</component>
				</slot>
			</template>
		</div>
	</summary-details>
</template>

<script setup>
import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNumber } from "@lewishowles/helpers/number";

import NotificationInfo from "./fragments/notification-info/notification-info.vue";
import NotificationRead from "./fragments/notification-read/notification-read.vue";

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
			if (props.hideNotificationsWhenRead && get(notification, "read") === true) {
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
	if (get(notification, "read") === true) {
		return "notification-read-template";
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
	if (get(notification, "read") === true) {
		return NotificationRead;
	}

	return NotificationInfo;
}
</script>
