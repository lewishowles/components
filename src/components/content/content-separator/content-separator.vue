<template>
	<component
		:is="tag"
		class="border-grey-200"
		v-bind="{
			class: { 'border-t': isHorizontal, 'border-l': isVertical },
			'aria-hidden': !isSemantic,
			'aria-orientation': explicitOrientation,
		}"
		data-component="content-separator"
		data-test="content-separator"
	/>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	/**
	 * The tag to use for this separator. Use `div` for a visual separator with
	 * no semantic meaning, and `hr` for a separator that marks a thematic break
	 * in content.
	 */
	tag: {
		type: String,
		default: "div",
	},

	/**
	 * The orientation of the separator. Use `horizontal` for a line that
	 * separates content above and below, and `vertical` for one that separates
	 * content side by side.
	 */
	orientation: {
		type: String,
		default: "horizontal",
	},
});

// Whether the separator is horizontal or vertical.
const isHorizontal = computed(() => props.orientation !== "vertical");
const isVertical = computed(() => props.orientation === "vertical");
// Whether this separator is a break in content, or just decorative.
const isSemantic = computed(() => props.tag === "hr");
// Or orientation, only when it makes sense.
const explicitOrientation = computed(() => (isSemantic.value ? props.orientation : undefined));
</script>
