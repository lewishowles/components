<template>
	<div class="flex w-full gap-3 rounded border p-4" :class="alertColours" role="alert" data-test="alert-message">
		<div v-if="haveIcon" class="mt-1">
			<slot name="icon">
				<component :is="defaultIcon" data-test="alert-message-icon" />
			</slot>
		</div>

		<div class="flex flex-col">
			<component :is="titleTag" v-if="haveTitleSlot" class="font-semibold" data-test="alert-message-title">
				<slot name="title" />
			</component>

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
		default: "muted",
	},

	/**
	 * Whether to show a provided icon, especially useful for the alert types
	 * that have an icon by default.
	 */
	showIcon: {
		type: Boolean,
		default: true,
	},

	/**
	 * The tag to use for the title.
	 */
	titleTag: {
		type: String,
		default: "h3",
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
			return "border-green-200 bg-green-50 text-green-800 dark:border-transparent dark:bg-green-500/50 dark:text-green-200";
		case "error":
			return "border-red-200 bg-red-50 text-red-800 dark:border-transparent dark:bg-red-500/50 dark:text-red-200";
		case "warning":
			return "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-transparent dark:bg-yellow-500/50 dark:text-yellow-200";
		case "info":
			return "border-purple-200 bg-purple-50 text-purple-800 dark:border-transparent dark:bg-purple-500/50 dark:text-purple-200";
		default:
			return "border-grey-200 bg-grey-50 text-grey-800 dark:border-transparent dark:bg-grey-500/50 dark:text-grey-200";
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

// Whether a title has been provided via the `title` slot.
const haveTitleSlot = computed(() => isNonEmptySlot(slots.title));
</script>
