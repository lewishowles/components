<template>
	<summary-details
		ref="summary-details"
		v-bind="{
			floating: true,
			align: computedAlign,
			placement: computedPlacement,
			closeWithClickOutside: true,
			summaryClasses,
			detailsClasses: [
				'w-screen',
				detailsPlacementClasses,
				detailsClasses,
				detailsColourClasses,
				detailsSizeClasses,
				detailsAdditionalClasses,
				{ invisible: isPositioning },
			],
		}"
		data-component="floating-details"
		data-test="floating-details"
		@open="handleOpen"
		@close="handleClose"
	>
		<template #summary="summarySlotProps">
			<slot name="summary" v-bind="summarySlotProps" />
		</template>

		<template #default="contentSlotProps">
			<slot v-bind="contentSlotProps" />
		</template>
	</summary-details>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref, useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * Whether to align the panel to the start or end of the summary. The panel
	 * flips to the opposite side if it would clip the viewport edge.
	 */
	align: {
		type: String,
		default: "start",
	},

	/**
	 * Whether to open the panel above or below the trigger. The panel flips to
	 * the opposite side if it would clip the viewport edge.
	 */
	placement: {
		type: String,
		default: "below",
	},

	/**
	 * Any classes to add to the summary element, allowing styling to wrap both
	 * the summary and icons.
	 */
	summaryClasses: {
		type: [String, Array, Object],
		default: "button--muted",
	},

	/**
	 * Any classes to add to the details content.
	 */
	detailsClasses: {
		type: [String, Array, Object],
		default: "rounded-md border p-4 shadow",
	},

	/**
	 * Any colours to apply to the details. These are passed as additional
	 * classes, but are separate so that colours can be redefined without
	 * affecting remaining styling.
	 */
	detailsColourClasses: {
		type: [String, Array, Object],
		default:
			"border-grey-200 bg-white dark:border-transparent dark:bg-grey-950/80 backdrop-blur-lg",
	},

	/**
	 * Any classes to add to specify the details content's size. This is
	 * separate to details classes so that the appearance can be consistent even
	 * if the size is not.
	 */
	detailsSizeClasses: {
		type: [String, Array, Object],
		default: "max-w-[calc(100vw-1rem)] lg:max-w-lg",
	},

	/**
	 * Any classes to add that don't fit into other categories. This is so that
	 * existing classes do not have to be reproduced.
	 */
	detailsAdditionalClasses: {
		type: [String, Array, Object],
		default: null,
	},
});

const summaryDetailsReference = useTemplateRef("summary-details");

// The resolved placement after measuring available viewport space on open.
const computedPlacement = ref(props.placement);
// The resolved alignment after measuring available viewport space on open.
const computedAlign = ref(props.align);
// Hides the panel while positioning is calculated, preventing a layout flash.
const isPositioning = ref(false);

// Pending requestAnimationFrame ID for throttling scroll and resize handlers.
let rafFrame = null;

// The gap class between the trigger and panel, kept in sync with the resolved
// placement.
const detailsPlacementClasses = computed(() => {
	if (computedPlacement.value === "above") {
		return "mb-3";
	}

	return "mt-3";
});

/**
 * Measure available viewport space and flip placement or alignment if the panel
 * would clip. Each axis is assessed independently: only flips when the panel
 * won't fit on the preferred side but will fit on the opposite side. If neither
 * side fits, the preferred side is kept.
 */
function updatePositioning() {
	const triggerElement = summaryDetailsReference.value?.summaryElement;
	const panelElement = summaryDetailsReference.value?.contentElement;

	if (!triggerElement || !panelElement) {
		return;
	}

	const triggerRectangle = triggerElement.getBoundingClientRect();
	const panelHeight = panelElement.offsetHeight;
	const panelWidth = panelElement.offsetWidth;

	const spaceBelow = window.innerHeight - triggerRectangle.bottom;
	const spaceAbove = triggerRectangle.top;
	const spaceFromStart = window.innerWidth - triggerRectangle.left;
	const spaceFromEnd = triggerRectangle.right;

	const fitsBelow = panelHeight <= spaceBelow;
	const fitsAbove = panelHeight <= spaceAbove;
	const fitsStart = panelWidth <= spaceFromStart;
	const fitsEnd = panelWidth <= spaceFromEnd;

	if (props.placement === "below") {
		computedPlacement.value = !fitsBelow && fitsAbove ? "above" : "below";
	} else {
		computedPlacement.value = !fitsAbove && fitsBelow ? "below" : "above";
	}

	if (props.align === "start") {
		computedAlign.value = !fitsStart && fitsEnd ? "end" : "start";
	} else {
		computedAlign.value = !fitsEnd && fitsStart ? "start" : "end";
	}
}

/**
 * RAF-throttled handler so positioning recalculates at most once per animation
 * frame during scroll and resize.
 */
function schedulePositioningUpdate() {
	if (rafFrame !== null) {
		return;
	}

	rafFrame = requestAnimationFrame(() => {
		updatePositioning();

		rafFrame = null;
	});
}

/**
 * After the panel opens, hide it while measuring available space, apply the
 * correct placement, then reveal it — preventing any layout flash.
 */
async function handleOpen() {
	computedPlacement.value = props.placement;
	computedAlign.value = props.align;
	isPositioning.value = true;

	await nextTick();

	updatePositioning();
	isPositioning.value = false;

	window.addEventListener("scroll", schedulePositioningUpdate, { capture: true, passive: true });
	window.addEventListener("resize", schedulePositioningUpdate, { passive: true });
}

/**
 * Remove viewport listeners when the panel closes.
 */
function handleClose() {
	window.removeEventListener("scroll", schedulePositioningUpdate, { capture: true });
	window.removeEventListener("resize", schedulePositioningUpdate);

	if (rafFrame !== null) {
		cancelAnimationFrame(rafFrame);
		rafFrame = null;
	}
}

onUnmounted(() => {
	handleClose();
});

/**
 * Open the details element.
 */
function openDetails() {
	runComponentMethod(summaryDetailsReference.value, "openDetails");
}

/**
 * Close the details element.
 */
function closeDetails() {
	runComponentMethod(summaryDetailsReference.value, "closeDetails");
}

defineExpose({
	closeDetails,
	openDetails,
});
</script>
