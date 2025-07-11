<template>
	<notification-base
		v-bind="{
			notification,
			allowMarkRead: false,
			locale,
			dateFormat,
			stripeClasses: 'hidden',
			badgeClasses: 'hidden',
			titleClasses: 'text-grey-500 dark:text-white/60',
			textClasses: 'text-grey-500 dark:text-white/60',
		}"
		data-test="notification-read"
	>
		<template #view-more-label>
			<slot name="view-more-label" />
		</template>

		<template #actions="slotParameters">
			<slot name="actions" v-bind="slotParameters || {}" />
		</template>
	</notification-base>
</template>

<script setup>
import NotificationBase from "../notification-base/notification-base.vue";

defineProps({
	/**
	 * The details of the notification to display.
	 */
	notification: {
		type: Object,
		default: () => ({}),
	},

	/**
	 * The locale to use when displaying dates.
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
		default: null,
	},
});
</script>
