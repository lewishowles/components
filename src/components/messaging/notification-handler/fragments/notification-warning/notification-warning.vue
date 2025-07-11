<template>
	<notification-base
		class="bg-orange-50/50 dark:bg-orange-500/10 rounded-e-lg"
		v-bind="{
			notification,
			locale,
			dateFormat,
			stripeClasses: 'bg-orange-100 dark:bg-orange-500/50',
			iconBackgroundClasses: 'bg-orange-50 dark:bg-orange-500/50',
			iconClasses: 'text-orange-600 dark:text-orange-200',
			badgeClasses: 'text-orange-600 dark:text-orange-500/50',
			titleClasses: 'text-orange-800 dark:text-orange-400'
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
		default: null,
	},
});
</script>
