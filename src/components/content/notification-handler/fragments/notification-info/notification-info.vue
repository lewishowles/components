<template>
	<notification-base
		v-bind="{
			notification,
			stripeClasses: 'bg-purple-100',
			badgeClasses: 'bg-purple-800',
			titleClasses: 'text-grey-950'
		}"
		data-test="notification-info"
	/>
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
});
</script>
