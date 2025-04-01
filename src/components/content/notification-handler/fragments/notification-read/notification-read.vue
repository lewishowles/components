<template>
	<notification-base
		v-bind="{
			notification,
			stripeClasses: 'hidden',
			badgeClasses: 'hidden',
			titleClasses: 'text-grey-500',
			textClasses: 'text-grey-500',
		}"
		data-test="notification-read"
	>
		<template #view-more-label>
			<slot name="view-more-label" />
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
});
</script>
