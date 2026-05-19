<template>
	<div data-test="accordion-group">
		<div class="flex items-center gap-4">
			<ui-button icon-start="icon-chevron-down-circled" class="text-purple-800 hocus:underline dark:text-purple-300" :disabled="areAllPanelsVisible" data-test="accordion-group-expand-button" @click="showAllPanels">
				<slot name="show-all-panels-label">
					Expand all
				</slot>
			</ui-button>

			<ui-button icon-start="icon-chevron-up-circled" class="text-purple-800 hocus:underline dark:text-purple-300" :disabled="areNoPanelsVisible" data-test="accordion-group-collapse-button" @click="hideAllPanels">
				<slot name="hide-all-panels-label">
					Collapse all
				</slot>
			</ui-button>
		</div>

		<div class="divide-y divide-grey-200">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { computed, isRef, provide, ref, useSlots } from "vue";
import { getSlotText, runComponentMethod } from "@lewishowles/helpers/vue";
import { isFunction } from "@lewishowles/helpers/general";
import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";

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
// Whether no panels are currently visible.
const areNoPanelsVisible = computed(() => panels.value.every(panel => panel.isVisible === false));

function registerPanel({ isVisible, show, hide }) {
	if (!isRef(isVisible) || !isFunction(show) || !isFunction(hide)) {
		return;
	}

	panels.value.push({ isVisible, show, hide });
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
	headingLevel: props.headingLevel,
	hidePanelLabel: hidePanelLabel,
	panelCount: computed(() => arrayLength(panels.value)),
	registerPanel,
	showPanelLabel: showPanelLabel,
});
</script>
