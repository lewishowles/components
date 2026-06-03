<template>
	<notification-base
		class="bg-warning-50/50 dark:bg-warning-500/10 rounded-e-lg"
		v-bind="{
			notification,
			locale,
			dateFormat,
			stripeClasses: 'bg-warning-100 dark:bg-warning-500/50',
			iconBackgroundClasses: 'bg-warning-subtle',
			iconClasses: 'text-warning-600 dark:text-warning-200',
			badgeClasses: 'text-warning-600 dark:text-warning-500/50',
			titleClasses: 'text-warning-800 dark:text-warning-400',
		}"
		data-test="notification-warning"
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
		default: undefined,
	},
});
</script>
