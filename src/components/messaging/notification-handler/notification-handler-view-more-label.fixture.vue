<template>
	<notification-handler align="start">
		<template #view-more-label>View something</template>
	</notification-handler>
</template>

<script setup>
import NotificationHandler from "./notification-handler.vue";
import { onBeforeUnmount } from "vue";
import { useNotifications } from "@/composables/use-notifications/use-notifications.js";

const props = defineProps({
	notifications: {
		type: Array,
		default: () => [],
	},
});

const registry = useNotifications();

registry.clear();
props.notifications.forEach((notification) => registry.add(notification));

onBeforeUnmount(() => registry.clear());
</script>
