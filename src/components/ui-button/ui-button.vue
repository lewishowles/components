<template>
	<button
		type="button"
		class="flex items-center gap-2"
		:class="{ 'relative': reactive }"
		data-test="ui-button"
		v-bind="attributes"
		@click="react"
	>
		<component :is="iconStart" v-if="haveIconStart" class="size-[0.857em] stroke-current" />

		<span :class="{ 'invisible': isReacting }" data-test="ui-button-label">
			<slot />
		</span>

		<span v-if="reactive" v-show="isReacting" class="absolute inset-0 flex items-center justify-center" data-test="ui-button-loading">
			<icon-loading class="stroke-current" />

			<span class="sr-only">
				<slot name="loading">
					Loading
				</slot>
			</span>
		</span>

		<component :is="iconEnd" v-if="haveIconEnd" class="size-[0.857em] stroke-current" />
	</button>
</template>

<script setup>
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
	isReacting.value = true;

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
