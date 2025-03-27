<template>
	<div class="px-8 py-4 text-grey-500" data-test="notification-read">
		{{ notification.message }}
	</div>
</template>

<script setup>
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
