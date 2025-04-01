<template>
	<notification-base
		class="bg-red-50/50 rounded-e-lg"
		v-bind="{
			notification,
			locale,
			dateFormat,
			stripeClasses: 'bg-red-100',
			iconBackgroundClasses: 'bg-red-50',
			iconClasses: 'text-red-600',
			badgeClasses: 'bg-red-600',
			titleClasses: 'text-red-800'
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
