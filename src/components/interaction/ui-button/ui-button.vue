<template>
	<button
		type="button"
		class="inline-flex items-center"
		:class="{ 'relative': reactive }"
		v-bind="attributes"
		data-test="ui-button"
		@click="react"
	>
		<component :is="iconStart" v-if="haveIconStart" :class="[computedIconClasses, { 'me-2': !iconOnly }]" data-test="ui-button-icon-start" />

		<conditional-wrapper v-bind="{ wrap: reactive || iconOnly, tag: 'span' }" :class="{ 'invisible': isReacting, 'sr-only': iconOnly }" data-test="ui-button-label">
			<slot />
		</conditional-wrapper>

		<span v-if="reactive" v-show="isReacting" class="absolute inset-0 flex items-center justify-center" data-test="ui-button-loading">
			<icon-loading class="stroke-current animate-spin" />

			<span class="sr-only">
				<slot name="loading-label">
					Loading
				</slot>
			</span>
		</span>

		<component :is="iconEnd" v-if="haveIconEnd" :class="[computedIconClasses, { 'ms-2': !iconOnly }]" data-test="ui-button-icon-end" />
	</button>
</template>

<script setup>
/**
 * Create a multi-purpose button.
 *
 * Optional icons can be added at either end of the button (`iconStart`,
 * `iconEnd`), using any defined icon in the component library.
 *
 * A special `reactive` mode allows for the button to show a loading indicator
 * when activated, which can be reset via an exposed `reset` method.
 */
import { computed, ref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * An icon to display at the start of the button.
	 */
	iconStart: {
		type: String,
		default: null,
	},

	/**
	 * An icon to display at the end of the button.
	 */
	iconEnd: {
		type: String,
		default: null,
	},

	/**
	 * Only display an icon (with "sr-only" text)
	 */
	iconOnly: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether this button is "reactive", that is, it will show a loading
	 * indicator when activated.
	 */
	reactive: {
		type: Boolean,
		default: false,
	},

	/**
	 * Any classes to add to the icon itself. If a size class is added
	 * (`size-`), the default size class will not be included.
	 */
	iconClasses: {
		type: String,
		default: null,
	},
});

const emit = defineEmits(["click"]);
// Whether the button is currently reacting.
const isReacting = ref(false);
// Whether a start icon is defined.
const haveIconStart = computed(() => isNonEmptyString(props.iconStart));
// Whether an end icon is defined.
const haveIconEnd = computed(() => isNonEmptyString(props.iconEnd));

// Any additional attributes to apply to the button. For example, aria-live if
// the button is reactive.
const attributes = computed(() => {
	const attributes = {};

	if (props.reactive) {
		attributes["aria-live"] = "polite";
	}

	return attributes;
});

// Classes to apply to the icons. For this, we check whether the user has
// provided their own `size-` or `stroke-` classes, and merge those with the
// defaults.
const computedIconClasses = computed(() => {
	if ((!haveIconStart.value && !haveIconEnd.value)) {
		return;
	}

	const baseStrokeClass = "stroke-current";
	const baseAlignmentClasses = "inline-block align-[0]";
	const baseSizeClass = props.iconOnly ? "size-[1em]" : "size-[0.857em]";
	const defaultClasses = [baseStrokeClass, baseAlignmentClasses, baseSizeClass];

	if (!isNonEmptyString(props.iconClasses)) {
		return isReacting.value ? [...defaultClasses, "invisible"] : defaultClasses;
	}

	const classes = props.iconClasses.split(" ");

	if (!classes.some(className => className.includes("stroke-"))) {
		classes.push(baseStrokeClass);
	}

	if (!classes.some(className => className.includes("size-"))) {
		classes.push(baseSizeClass);
	}

	if (isReacting.value) {
		classes.push("invisible");
	}

	return classes;
});

/**
 * Provide feedback to the user on the state of the button.
 */
function react() {
	if (props.reactive) {
		isReacting.value = true;
	}

	emit("click");
}

/**
 * Reset the reacting state of the button.
 */
function reset() {
	isReacting.value = false;
}

defineExpose({
	reset,
});
</script>
