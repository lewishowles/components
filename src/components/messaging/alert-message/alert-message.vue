<template>
	<div
		class="flex w-full gap-3 rounded-lg border p-4"
		:class="alertColours"
		:role="alertRole"
		:aria-live="alertLive"
		data-component="alert-message"
		:data-state="alertType"
		data-test="alert-message"
	>
		<div v-if="haveIcon" class="mt-1" data-part="icon">
			<slot name="icon">
				<component :is="defaultIcon" data-test="alert-message-icon" />
			</slot>
		</div>

		<div class="flex flex-col">
			<component
				:is="titleTag"
				v-if="haveTitleSlot"
				class="font-semibold"
				data-part="title"
				data-test="alert-message-title"
			>
				<slot name="title" />
			</component>

			<div data-part="content">
				<span
					v-if="alertType !== alertTypes.MUTED"
					class="sr-only"
					data-test="alert-message-type-prefix"
				>
					{{ alertPrefix }}:
				</span>
				<slot />
			</div>
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
	 * Whether this alert should function as a live region, announcing its
	 * content to screen readers. Set to false for static alerts that are
	 * present on page load, to avoid unnecessary interruption.
	 */
	live: {
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

// The available alert types.
const alertTypes = {
	ERROR: "error",
	INFO: "info",
	MUTED: "muted",
	SUCCESS: "success",
	WARNING: "warning",
};

// The valid message types and the default to fall back to.
const messageTypes = Object.values(alertTypes);
const defaultMessageType = alertTypes.MUTED;

const slots = useSlots();

// The internal message type, accounting for an invalid choice by the user.
const alertType = computed(() => {
	if (messageTypes.includes(props.type)) {
		return props.type;
	}

	return defaultMessageType;
});

// The ARIA role for this alert. This allows error and warning alerts to be
// assertive, and other alerts to be polite. If the alert is not live, the role
// is not required.
const alertRole = computed(() => {
	if (!props.live) {
		return null;
	}

	if (alertType.value === alertTypes.ERROR || alertType.value === alertTypes.WARNING) {
		return "alert";
	}

	return "status";
});

// The aria-live value for this alert, this is only required for "status" role
// alerts.
const alertLive = computed(() => {
	if (alertRole.value === "status") {
		return "polite";
	}

	return null;
});

// The sr-only type prefix shown before the alert content, e.g. "Error: ".
const alertPrefix = computed(() => {
	const type = alertType.value;

	return type.charAt(0).toUpperCase() + type.slice(1);
});

// The colours of the alert message, based on the type.
const alertColours = computed(() => {
	switch (alertType.value) {
		case alertTypes.SUCCESS:
			return "border-success-200 bg-success-subtle text-success dark:border-transparent";
		case alertTypes.ERROR:
			return "border-danger-200 bg-danger-subtle text-danger dark:border-transparent";
		case alertTypes.WARNING:
			return "border-warning-200 bg-warning-subtle text-warning dark:border-transparent";
		case alertTypes.INFO:
			return "border-primary-200 bg-primary-subtle text-primary-800 dark:border-transparent dark:text-primary-200";
		default:
			return "border-border bg-surface-subtle text-grey-800 dark:border-transparent dark:text-grey-200";
	}
});

// Whether an icon has been provided via the `icon` slot.
const haveIconSlot = computed(() => isNonEmptySlot(slots.icon));

// Whether we have an icon to display, based on any provided slot, the alert
// type, or the `showIcon` prop.
const haveIcon = computed(
	() => props.showIcon && (alertType.value !== alertTypes.MUTED || haveIconSlot.value),
);

// The icon to display by default, based on the alert type.
const defaultIcon = computed(() => {
	switch (alertType.value) {
		case alertTypes.SUCCESS:
			return "icon-check-circled";
		case alertTypes.ERROR:
			return "icon-danger";
		case alertTypes.WARNING:
			return "icon-warning";
		case alertTypes.INFO:
			return "icon-info";
	}

	return null;
});

// Whether a title has been provided via the `title` slot.
const haveTitleSlot = computed(() => isNonEmptySlot(slots.title));
</script>
