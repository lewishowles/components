<template>
	<notification-handler align="start" v-bind="$attrs" @notifications:reload="reloadCount++">
		<template v-if="$slots['notification-read-template']" #notification-read-template>
			<slot name="notification-read-template" />
		</template>

		<template v-if="$slots['notification-info-template']" #notification-info-template>
			<slot name="notification-info-template" />
		</template>

		<template v-if="$slots['notification-warning-template']" #notification-warning-template>
			<slot name="notification-warning-template" />
		</template>

		<template v-if="$slots['notification-danger-template']" #notification-danger-template>
			<slot name="notification-danger-template" />
		</template>

		<template v-if="$slots['notification-pinned-template']" #notification-pinned-template>
			<slot name="notification-pinned-template" />
		</template>

		<template v-if="$slots['view-more-label']" #view-more-label>
			<slot name="view-more-label" />
		</template>

		<template v-if="$slots['notification-actions']" #notification-actions>
			<slot name="notification-actions" />
		</template>
	</notification-handler>

	<div data-test="notification-handler-reload-count" :data-count="reloadCount" />
</template>

<script setup>
import NotificationHandler from "./notification-handler.vue";
import { onBeforeUnmount, ref } from "vue";
import { useNotifications } from "@/composables/use-notifications/use-notifications.js";

defineOptions({ inheritAttrs: false });

const props = defineProps({
	notifications: {
		type: Array,
		default: () => [],
	},
});

const reloadCount = ref(0);

const registry = useNotifications();

registry.clear();
props.notifications.forEach((notification) => registry.add(notification));

onBeforeUnmount(() => registry.clear());
</script>
