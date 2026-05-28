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
				placementClasses,
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
import { computed, toRef, useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import { useFloatingPosition } from "@/composables";

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

// Computed refs that lazily resolve the DOM elements exposed by summary-details.
const summaryElementRef = computed(() => summaryDetailsReference.value?.summaryElement);
const contentElementRef = computed(() => summaryDetailsReference.value?.contentElement);

const {
	computedPlacement,
	computedAlign,
	isPositioning,
	placementClasses,
	handleOpen,
	handleClose,
} = useFloatingPosition({
	triggerElement: summaryElementRef,
	panelElement: contentElementRef,
	initialPlacement: toRef(props, "placement"),
	initialAlign: toRef(props, "align"),
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
