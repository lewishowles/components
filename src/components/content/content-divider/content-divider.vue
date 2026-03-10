<template>
	<component :is="tag" class="border border-t border-grey-200" :aria-hidden="screenReaderHidden" data-test="content-divider" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	/**
	 * The tag to use for this divider. Generally, this is a `div` for visual
	 * dividers, and `hr` for content dividers.
	 */
	tag: {
		type: String,
		default: "div",
	},
});

// Whether this divider should be hidden from screen readers
const screenReaderHidden = computed(() => props.tag !== "hr");
</script>
