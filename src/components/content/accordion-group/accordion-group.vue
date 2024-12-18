<template>
	<div>
		<button type="button" aria-expanded="false">
			Show all sections
		</button>

		<slot />
	</div>
</template>

<script setup>
import { isRef, provide, ref } from "vue";
import { isFunction } from "@lewishowles/helpers/general";

provide("accordion-group", {
	registerSection,
});

// A reference to each of the sections belonging to this accordion.
const sections = ref([]);

function registerSection({ isOpen, open, close }) {
	if (!isRef(isOpen) || !isFunction(open) || !isFunction(close)) {
		return;
	}

	sections.value.push({ isOpen, open, close });
}

// If all children are open, toggle wording of button
// Allow button to open and close all children
</script>
