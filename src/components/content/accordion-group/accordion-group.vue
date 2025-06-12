<template>
	<div data-test="accordion-group">
		<button type="button" class="inline-flex items-center gap-2 text-purple-800 hocus:underline dark:text-purple-300" v-bind="{ 'aria-expanded': areAllPanelsVisible }" data-test="accordion-group-button" @click="toggleAllPanels">
			<component :is="statusIcon" class="size-text" />

			<span v-show="!areAllPanelsVisible">
				<slot name="show-all-panels-label">
					Show all panels
				</slot>
			</span>

			<span v-show="areAllPanelsVisible" class="inline-flex items-center gap-2">
				<slot name="hide-all-panels-label">
					Hide all panels
				</slot>
			</span>
		</button>

		<div class="divide-y divide-grey-200">
			<slot />
		</div>

		<slot v-if="0" name="show-panel-label">
			Show panel
		</slot>

		<slot v-if="0" name="hide-panel-label">
			Hide panel
		</slot>
	</div>
</template>

<script setup>
import { computed, isRef, provide, ref, useSlots } from "vue";
import { getSlotText, runComponentMethod } from "@lewishowles/helpers/vue";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray } from "@lewishowles/helpers/array";

const props = defineProps({
	/**
	 * The heading level to use for all panels.
	 */
	headingLevel: {
		type: String,
		default: "h2",
	},
});

const slots = useSlots();
// A reference to each of the panels belonging to this accordion.
const panels = ref([]);
// An overall label for each panel's "Show panel" action.
const showPanelLabel = computed(() => getSlotText(slots["show-panel-label"]));
// An overall label for each panel's "Hide panel" action.
const hidePanelLabel = computed(() => getSlotText(slots["hide-panel-label"]));
// Whether all of the panels are currently visible.
const areAllPanelsVisible = computed(() => panels.value.every(panel => panel.isVisible === true));
// The icon to show depending on the visibility of each panel.
const statusIcon = computed(() => (areAllPanelsVisible.value ? "icon-chevron-up-circled" : "icon-chevron-down-circled"));

function registerPanel({ isVisible, show, hide }) {
	if (!isRef(isVisible) || !isFunction(show) || !isFunction(hide)) {
		return;
	}

	panels.value.push({ isVisible, show, hide });
}

/**
 * Toggle all panels depending on their current state. If all panels are
 * visible, hide them. Otherwise, show all panels.
 */
function toggleAllPanels() {
	if (areAllPanelsVisible.value) {
		hideAllPanels();

		return;
	}

	showAllPanels();
}

/**
 * Show all panels of the accordion by calling their `show` methods in turn.
 */
function showAllPanels() {
	if (!isNonEmptyArray(panels.value)) {
		return;
	}

	for (const panel of panels.value) {
		runComponentMethod(panel, "show");
	}
}

/**
 * Hide all panels of the accordion by calling their `hide` methods in turn.
 */
function hideAllPanels() {
	if (!isNonEmptyArray(panels.value)) {
		return;
	}

	for (const panel of panels.value) {
		runComponentMethod(panel, "hide");
	}
}

provide("accordion-group", {
	registerPanel,
	headingLevel: props.headingLevel,
	showPanelLabel: showPanelLabel,
	hidePanelLabel: hidePanelLabel,
});
</script>
