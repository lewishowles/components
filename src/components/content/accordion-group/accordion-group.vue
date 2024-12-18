<template>
	<div>
		<ui-button v-bind="{ 'aria-expanded': allVisible }" @click="toggleAllSections">
			<span v-show="!allVisible">
				<slot name="show-all-sections-label">
					Show all sections
				</slot>
			</span>
			<span v-show="allVisible">
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
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * The label for each individual section's "Show" button.
	 */
	showSectionLabel: {
		type: String,
		default: "Show this section",
	},

	/**
	 * The label for each individual section's "Hide" button.
	 */
	hideSectionLabel: {
		type: String,
		default: "Hide this section",
	},
});

provide("accordion-group", {
	registerSection,
	showSectionLabel: props.showSectionLabel,
	hideSectionLabel: props.hideSectionLabel,
});

// A reference to each of the sections belonging to this accordion.
const sections = ref([]);

// Whether all of the sections are currently visible.
const allVisible = computed(() => sections.value.every(section => section.isVisible === true));

function registerSection({ isVisible, show, hide }) {
	if (!isRef(isVisible) || !isFunction(show) || !isFunction(hide)) {
		return;
	}

	sections.value.push({ isVisible, show, hide });
}

/**
 * Toggle all sections depending on their current state. If all sections are
 * visible, hide them. Otherwise, show all sections.
 */
function toggleAllSections() {
	if (allVisible.value) {
		hideAllSections();

		return;
	}

	showAllSections();
}

/**
 * Show all sections of the accordion by calling their `show` methods in turn.
 */
function showAllSections() {
	if (!isNonEmptyArray(sections.value)) {
		return;
	}

	for (const section of sections.value) {
		runComponentMethod(section, "show");
	}
}

/**
 * Hide all sections of the accordion by calling their `hide` methods in turn.
 */
function hideAllSections() {
	if (!isNonEmptyArray(sections.value)) {
		return;
	}

	for (const section of sections.value) {
		runComponentMethod(section, "hide");
	}
}
</script>
