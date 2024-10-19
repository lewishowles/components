<template>
	<div class="flex gap-2 rounded border p-4" :class="alertColours" role="alert" data-test="alert-message">
		<div v-if="haveIcon" class="mt-1">
			<slot name="icon">
				<component :is="defaultIcon" data-test="alert-message-icon" />
			</slot>
		</div>

		<div class="flex flex-col gap-1">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * The type of message, one of "success", "error", "warning", "info", or the
	 * default, "muted".
	 */
	type: {
		type: String,
		required: true,
	},

	/**
	 * Whether to show a provided icon, especially useful for the alert types
	 * that have an icon by default.
	 */
	showIcon: {
		type: Boolean,
		default: true,
	},
});

const messageTypes = ["success", "error", "warning", "info", "muted"];
const defaultMessageType = "muted";

const slots = useSlots();
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

// Whether an icon has been provided via the `icon` slot.
const haveIconSlot = computed(() => isNonEmptySlot(slots.icon));
// Whether we have an icon to display, based on any provided slot, the alert
// type, or the `showIcon` prop.
const haveIcon = computed(() => props.showIcon && (alertType.value !== "muted" || haveIconSlot.value));

// The colours of the alert message, based on the type.
const defaultIcon = computed(() => {
	switch (alertType.value) {
		case "success":
			return "icon-check-circled";
		case "error":
			return "icon-danger";
		case "warning":
			return "icon-warning";
		case "info":
			return "icon-info";
	}

	return null;
});
</script>
