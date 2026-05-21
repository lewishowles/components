<template>
	<summary-details ref="summary-details" v-bind="{ floating: true, align, placement, closeWithClickOutside: true, summaryClasses, detailsClasses: ['w-screen', detailsPlacementClasses, detailsClasses, detailsColourClasses, detailsSizeClasses, detailsAdditionalClasses] }" data-test="floating-details">
		<template #summary>
			<slot name="summary" />
		</template>

		<slot />
	</summary-details>
</template>

<script setup>
import { computed, useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * Whether to align to the dropdown to the start or end of the summary. This
	 * is useful for menus that open to the end of the screen, for example.
	 * Anything but "start" will be treated as "end".
	 */
	align: {
		type: String,
		default: "start",
	},

	/**
	 * Whether to open above or below the trigger. Use "above" for triggers near
	 * the bottom of the viewport, such as a footer user menu. Anything but
	 * "above" will be treated as "below".
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
		default: "border-grey-200 bg-white dark:border-transparent dark:bg-grey-950/80 backdrop-blur-lg",
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

// Spacing between the trigger and the panel, flipped to match placement direction.
const detailsPlacementClasses = computed(() => (props.placement === "above" ? "mb-3" : "mt-3"));

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
	openDetails,
	closeDetails,
});
</script>
