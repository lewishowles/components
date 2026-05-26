<template>
	<component :is="tag" class="border border-t border-grey-200" :aria-hidden="screenReaderHidden" data-test="content-separator" />
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
});

// Visual-only separators are hidden from screen readers; <hr> carries its own
// semantic meaning and is left visible to assistive technology.
const screenReaderHidden = computed(() => props.tag !== "hr");
</script>
