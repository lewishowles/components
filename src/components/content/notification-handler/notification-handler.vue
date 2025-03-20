<template>
	<summary-details v-bind="{ includeIcon: false, floating: true, align, summaryClasses: 'button--muted p-3', detailsClasses: 'mt-3 rounded-md border border-grey-200 bg-white p-4 shadow' }" class="w-min">
		<template #summary>
			<icon-bell />

			<span class="sr-only">
				<slot name="show-notifications-label">
					Show notifications
				</slot>
			</span>
		</template>

		Notification panel
	</summary-details>
</template>

<script setup>
import { computed } from "vue";
import { get, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";

const props = defineProps({
	/**
	 * The notifications to display to the user.
	 */
	notifications: {
		type: Array,
		default: null,
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

	return props.notifications
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
		}, [])
		.sort((a, b) => {
			// Sort our notifications by provided date, allowing one or both
			// notifications to be missing a date property. Notifications with
			// dates appear before those without.
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
});
</script>
