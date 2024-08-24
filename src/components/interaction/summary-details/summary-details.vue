<template>
	<details ref="detailsElement" data-test="summary-details" :class="{ 'relative': floating, 'z-50': isOpen && floating }" @toggle="updateState">
		<summary class="inline-flex cursor-pointer list-none items-center gap-1" :class="summaryClasses" data-test="summary-details-summary">
			<component :is="currentIcon" v-if="iconStart && includeIcon" data-test="summary-details-icon-start" />

			<slot name="summary" v-bind="{ isOpen, icon: currentIcon }" />

			<component :is="currentIcon" v-if="includeIcon && !iconStart" data-test="summary-details-icon-end" />
		</summary>

		<div :class="{ 'absolute top-full': floating, 'start-0': align === 'start', 'end-0': align !== 'start' }" data-test="summary-details-content">
			<slot v-bind="{ isOpen, icon: currentIcon }" />
		</div>
	</details>
</template>

<script setup>
/**
 * Provides an implementation of the `details` element with optional extras,
 * such as custom icons, and allows a simple way of having content that can be
 * toggled. Suitable for items such as FAQs or even dropdown menus.
 */
import { computed, onMounted, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * Whether the details element should initially be open.
	 */
	open: {
		type: Boolean,
		default: false,
	},

	/**
	 * The icon to display when the details are open.
	 */
	iconOpen: {
		type: String,
		default: "icon-chevron-up",
	},

	/**
	 * The icon to display when the details are closed.
	 */
	iconClosed: {
		type: String,
		default: "icon-chevron-down",
	},

	/**
	 * An override icon, shown both when details are open and closed.
	 */
	icon: {
		type: String,
		default: null,
	},

	/**
	 * Whether to display the icon at the start of the summary, as opposed to
	 * the end.
	 */
	iconStart: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to include a summary icon at all. This allows more flexibility
	 * with the styling of the summary, but it is important to make it clear to
	 * the user what is happening.
	 */
	includeIcon: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether the details should float when opened, perfect for drop down
	 * menus.
	 */
	floating: {
		type: Boolean,
		default: false,
	},

	/**
	 * When floating, whether to align to the dropdown to the start or end of
	 * the summary. This is useful for menus that open to the end of the screen,
	 * for example. Anything but "start" will be treated as "end".
	 */
	align: {
		type: String,
		default: "start",
	},

	/**
	 * Any classes to add to the summary element, allowing styling to wrap both
	 * the summary and icons.
	 */
	summaryClasses: {
		type: String,
		default: null,
	},
});

// Whether the details are currently open.
const isOpen = ref(props.open);
// A reference to the details element, from which we can determine the current
// "open" state.
const detailsElement = ref(null);

// The current icon to display. If an override icon is chosen, we always return
// that, otherwise we return the appropriate icon for the current state.
const currentIcon = computed(() => {
	if (isNonEmptyString(props.icon)) {
		return props.icon;
	}

	if (isOpen.value) {
		return props.iconOpen;
	}

	return props.iconClosed;
});

/**
 * When mounting, sync up our desired initial state with the details element
 * itself.
 */
onMounted(() => {
	if (isOpen.value && detailsElement.value.open === false) {
		detailsElement.value.open = true;
	}
});

/**
 * Update the current open state based on the details element.
 */
function updateState() {
	isOpen.value = detailsElement.value.open;
}
</script>
