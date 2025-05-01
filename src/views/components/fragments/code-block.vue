<template>
	<pre><code><slot /></code></pre>
</template>

<script setup>
import { computed, useSlots } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const slots = useSlots();

// The text from the default slot.
const defaultText = computed(() => {
	function getText(nodes) {
		if (!isNonEmptyArray(nodes)) {
			return "";
		}

		let text = "";

		nodes.forEach(node => {
			if (isNonEmptyString(node.children)) {
				text += node.children;

				return;
			} else if (Array.isArray(node.children) && node.children.length) {
				return getText(node.children);
			}
		});

		return text;
	}

	const slot = slots.default;
	const nodes = slot();

	return getText(nodes);
});
</script>
