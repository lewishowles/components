<template>
	<button
		type="button"
		class="flex items-center justify-center gap-2"
		:class="{ 'relative': reactive }"
		data-test="ui-button"
		v-bind="attributes"
		@click="react"
	>
		<component :is="iconStart" v-if="haveIconStart" class="size-[0.857em] stroke-current" data-test="ui-button-icon-start" />

		<conditional-wrapper v-bind="{ wrap: reactive, tag: 'span' }" :class="{ 'invisible': isReacting }" data-test="ui-button-label">
			<slot />
		</conditional-wrapper>

		<span v-if="reactive" v-show="isReacting" class="absolute inset-0 flex items-center justify-center" data-test="ui-button-loading">
			<icon-loading class="stroke-current" />

			<span class="sr-only">
				<slot name="loading">
					Loading
				</slot>
			</span>
		</span>

		<component :is="iconEnd" v-if="haveIconEnd" class="size-[0.857em] stroke-current" data-test="ui-button-icon-end" />
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
	 * Whether this button is "reactive", that is, it will show a loading
	 * indicator when activated.
	 */
	reactive: {
		type: Boolean,
		default: false,
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
