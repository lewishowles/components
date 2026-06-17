<script setup>
import { useFlashMessages } from "@/composables";

const props = defineProps({
	/** The namespace passed to flash-messages to filter which messages are shown. */
	namespace: String,
});

const { sendMessage } = useFlashMessages();

// Send both a global and a namespaced message before render so flash-messages
// picks up the correct set based on its namespace prop.
sendMessage({ type: "success", title: "Alert approved", message: "The alert has been approved." });
sendMessage({
	namespace: "user-alert",
	type: "success",
	title: "Alert approved",
	message: "The alert has been approved.",
});
</script>

<template>
	<flash-messages v-bind="{ namespace: props.namespace }" />
</template>
