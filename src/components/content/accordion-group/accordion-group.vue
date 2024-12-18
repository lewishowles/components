<template>
	<div>
		<ui-button v-bind="{ 'aria-expanded': areAllOpen }">
			<span v-show="!areAllOpen">
				<slot name="show-all-sections-label">
					Show all sections
				</slot>
			</span>
			<span v-show="areAllOpen">
				<slot name="hide-all-sections-label">
					Hide all sections
				</slot>
			</span>
		</ui-button>

		<slot />
	</div>
</template>

<script setup>
import { computed, isRef, provide, ref } from "vue";
import { isFunction } from "@lewishowles/helpers/general";

const props = defineProps({
	/**
	 * The label for each individual section's "Show" button.
	 */
	showSectionLabel: {
		type: String,
		default: "Show",
	},

	/**
	 * The label for each individual section's "Hide" button.
	 */
	hideSectionLabel: {
		type: String,
		default: "Hide",
	},
});

provide("accordion-group", {
	registerSection,
	showSectionLabel: props.showSectionLabel,
	hideSectionLabel: props.hideSectionLabel,
});

// A reference to each of the sections belonging to this accordion.
const sections = ref([]);

// Whether all of the sections are currently open.
const areAllOpen = computed(() => sections.value.every(section => section.isOpen === true));

function registerSection({ isOpen, open, close }) {
	if (!isRef(isOpen) || !isFunction(open) || !isFunction(close)) {
		return;
	}

	sections.value.push({ isOpen, open, close });
}

// If all children are open, toggle wording of button
// Allow button to open and close all children
</script>
