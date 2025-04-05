<template>
	<notification-base
		v-bind="{
			notification,
			locale,
			dateFormat,
			stripeClasses: 'bg-purple-100',
			iconBackgroundClasses: 'bg-purple-50',
			iconClasses: 'text-purple-600',
			badgeClasses: 'text-purple-600',
		}"
		data-test="notification-info"
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
