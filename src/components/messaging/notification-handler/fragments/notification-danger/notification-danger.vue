<template>
	<notification-base
		class="bg-danger-50/50 dark:bg-danger-500/10 rounded-e-lg"
		v-bind="{
			notification,
			locale,
			dateFormat,
			stripeClasses: 'bg-danger-100 dark:bg-danger-500/50',
			iconBackgroundClasses: 'bg-danger-subtle',
			iconClasses: 'text-danger-600 dark:text-danger-200',
			badgeClasses: 'text-danger-600 dark:text-danger-500/50',
			titleClasses: 'text-danger-800 dark:text-danger-400',
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
		default: undefined,
	},
});
</script>
