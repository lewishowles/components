<template>
	<notification-base
		class="bg-red-50/50 dark:bg-red-500/10 rounded-e-lg"
		v-bind="{
			notification,
			locale,
			dateFormat,
			stripeClasses: 'bg-red-100 dark:bg-red-500/50',
			iconBackgroundClasses: 'bg-red-50 dark:bg-red-500/50',
			iconClasses: 'text-red-600 dark:text-red-200',
			badgeClasses: 'text-red-600 dark:text-red-500/50',
			titleClasses: 'text-red-800 dark:text-red-400'
		}"
		data-test="notification-danger"
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
