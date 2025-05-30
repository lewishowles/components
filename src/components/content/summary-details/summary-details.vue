<template>
	<details ref="detailsElement" v-bind="{ 'data-test': dataTest }" :class="floatingClasses" @toggle="updateState">
		<summary ref="summaryElement" class="inline-flex cursor-pointer list-none items-center gap-1" :class="summaryClasses" v-bind="{ 'data-test': `${dataTest}-summary` }">
			<component :is="currentIcon" v-if="iconStart && includeIcon" :class="iconClasses" v-bind="{ 'data-test': `${dataTest}-icon-start` }" />

			<slot name="summary" v-bind="{ isOpen, icon: currentIcon }" />

			<component :is="currentIcon" v-if="includeIcon && !iconStart" :class="iconClasses" v-bind="{ 'data-test': `${dataTest}-icon-end` }" />
		</summary>

		<div v-show="isOpen" :class="[{ 'absolute top-full animate-fade-in-down': floating, 'start-0': alignStart, 'end-0': !alignStart }, detailsClasses]" v-bind="{ 'data-test': `${dataTest}-content` }">
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
import { computed, onMounted, useAttrs, useTemplateRef, watch } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { onClickOutside, onKeyStroke, useFocusWithin } from "@vueuse/core";

const props = defineProps({
	/**
	 * Whether the details element should initially be open.
	 */
	open: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to close the details element when pressing escape. If focus is
	 * within this component, focus is moved to the summary element.
	 */
	closeWithEscape: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to close the details element when clicking outside of the
	 * component. This is best combined with `floating` for menus.
	 */
	closeWithClickOutside: {
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
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * Any classes to add to the details content.
	 */
	detailsClasses: {
		type: [String, Array, Object],
		default: "mt-3",
	},

	/**
	 * Any classes to add to the icon itself. Particularly useful if the icon is
	 * the only visible summary element.
	 */
	iconClasses: {
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * The data-test attribute for this element. This allows us to re-use the
	 * provided data-test attribute for sub-components..
	 */
	dataTest: {
		type: String,
		default: "summary-details",
	},
});

const emit = defineEmits(["open", "close"]);

const attrs = useAttrs();

// Whether the details are currently open.
const isOpen = defineModel({
	type: String,
});

// A reference to the details element, from which we can determine the current
// "open" state.
const detailsElement = useTemplateRef("detailsElement");
// A reference to the summary element, with which we can manage focus.
const summaryElement = useTemplateRef("summaryElement");
// Whether focus is currently within our details component. If it isn't, we will close our
const { focused: hasFocus } = useFocusWithin(detailsElement);

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

// Whether to align a floating dropdown to the start of the summary.
const alignStart = computed(() => props.align === "start");

// Classes to apply to the details element when floating is enabled. For this,
// we check whether the user has provided their own "absolute" class - such as
// if they want to position the menu. If so, we don't need to apply the
// "relative" class that would otherwise be necessary.
const floatingClasses = computed(() => {
	if (!props.floating) {
		return;
	}

	const classes = attrs.class ? attrs.class.split(" ") : [];

	if (!classes.includes("absolute") && !classes.includes("relative")) {
		classes.push("relative");
	}

	if (isOpen.value) {
		classes.push("z-50");
	}

	return classes;
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
 * When pressing escape, if requested, close the details element. If focus is
 * within the component, move focus to the summary.
 */
onKeyStroke("Escape", e => {
	e.preventDefault();

	if (!isOpen.value || !props.closeWithEscape) {
		return;
	}

	closeDetails();

	if (!hasFocus.value) {
		return;
	}

	summaryElement.value.focus();
});

onClickOutside(detailsElement, e => {
	e.preventDefault();

	if (!isOpen.value || !props.closeWithClickOutside) {
		return;
	}

	closeDetails();
});

/**
 * Update the current open state based on the details element.
 */
function updateState() {
	isOpen.value = detailsElement.value.open;
}

/**
 * Open the details element and update our internal representation.
 */
function openDetails() {
	detailsElement.value.open = true;

	updateState();
}

/**
 * Close the details element and update our internal representation.
 */
function closeDetails() {
	detailsElement.value.open = false;

	updateState();
}

watch(isOpen, () => {
	if (isOpen.value) {
		emit("open");

		return;
	}

	emit("close");
});

defineExpose({
	openDetails,
	closeDetails,
});
</script>
