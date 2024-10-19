<template>
	<div class="rounded border p-4" :class="alertColours" role="alert" data-test="alert-message">
		<slot />
	</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	/**
	 * The type of message, one of "success", "error", "warning", "info", or the
	 * default, "muted".
	 */
	type: {
		type: String,
		required: true,
	},
});

const messageTypes = ["success", "error", "warning", "info", "muted"];
const defaultMessageType = "muted";

// The internal message type, accounting for an invalid choice by the user.
const alertType = computed(() => (messageTypes.includes(props.type) ? props.type : defaultMessageType));

// The colours of the alert message, based on the type.
const alertColours = computed(() => {
	switch (alertType.value) {
		case "success":
			return "border-green-200 bg-green-50 text-green-800";
		case "error":
			return "border-red-200 bg-red-50 text-red-800";
		case "warning":
			return "border-yellow-200 bg-yellow-50 text-yellow-800";
		case "info":
			return "border-purple-200 bg-purple-50 text-purple-800";
		default:
			return "border-grey-200 bg-grey-50 text-grey-800";
	}
});
</script>
