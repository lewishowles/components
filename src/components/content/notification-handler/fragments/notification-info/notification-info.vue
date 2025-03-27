<template>
	<div class="relative py-4 ps-8 pe-12" data-test="notification-info">
		<div class="absolute inset-y-0 start-0 w-1 rounded-full bg-purple-100" />

		{{ notification.message }}

		<div class="absolute end-0 top-0 me-8 mt-5.5 size-2 rounded-full bg-purple-600" />
	</div>
</template>

<script setup>
import { computed } from "vue";
import { get } from "@lewishowles/helpers/object";

const props = defineProps({
	/**
	 * The details of the notification to display.
	 */
	notification: {
		type: Object,
		default: () => ({}),
	},
});

// Whether this notification is unread.
const isRead = computed(() => get(props, "notification.read") === true);
</script>
