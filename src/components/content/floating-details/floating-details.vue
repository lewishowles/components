<template>
	<summary-details
		ref="summary-details"
		data-component="floating-details"
		data-test="floating-details"
		v-bind="summaryDetailsProps"
		@open="handleOpen"
		@close="handleClose"
	>
		<template #summary="summarySlotProps">
			<slot name="summary" v-bind="summarySlotProps" />
		</template>

		<template #default="contentSlotProps">
			<overlay-sheet
				:class="props.detailsClasses"
				v-bind="{
					isOpen,
					isSheet: isNarrow,
					label: sheetLabel,
					closeWithEscape: props.closeWithEscape,
				}"
				data-test="floating-details-sheet"
				@click="handleSheetClick"
				@dismiss="handleDismiss"
			>
				<template #close-dialog-label>
					<slot name="close-dialog-label">Close dialog</slot>
				</template>

				<slot v-bind="contentSlotProps" />
			</overlay-sheet>
		</template>
	</summary-details>
</template>

<script setup>
import { callComponentMethod } from "@lewishowles/helpers/vue";
import { cn } from "@/utilities/cn.js";
import { computed, nextTick, ref, toRef, useAttrs, useTemplateRef, watch } from "vue";
import { onClickOutside, useMediaQuery } from "@vueuse/core";
import { useFloatingPosition } from "@/composables";

import OverlaySheet from "@/components/messaging/overlay-sheet/overlay-sheet.vue";

defineOptions({ inheritAttrs: false });

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
	 * Whether to close the panel when Escape is pressed.
	 */
	closeWithEscape: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to close the panel when clicking outside it.
	 */
	closeWithClickOutside: {
		type: Boolean,
		default: true,
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
	 * Any additional classes to apply to the details panel, merged on top of
	 * the panel's base styles. Any provided classes that conflict with base classes will override as necessary.
	 */
	detailsClasses: {
		type: [String, Array, Object],
		default: null,
	},
});

const attrs = useAttrs();
// A reference to the summary-details element
const summaryDetailsReference = useTemplateRef("summary-details");
// Whether details are currently open.
const isOpen = ref(false);
// Computed refs that lazily resolve the DOM elements exposed by summary-details.
const summaryElementRef = computed(() => summaryDetailsReference.value?.summaryElement);
const contentElementRef = computed(() => summaryDetailsReference.value?.contentElement);
// Whether the anchored panel should hand dismissal to the narrow sheet.
const isNarrow = useMediaQuery("(width < 1024px)");
// Derive a useful dialog label from the visible summary trigger.
const sheetLabel = computed(() => summaryElementRef.value?.textContent?.trim() || "Details");

const {
	computedPlacement,
	computedAlign,
	isPositioning,
	placementClasses,
	handleOpen: handleFloatingOpen,
	handleClose: handleFloatingClose,
} = useFloatingPosition({
	triggerElement: summaryElementRef,
	panelElement: contentElementRef,
	initialPlacement: toRef(props, "placement"),
	initialAlign: toRef(props, "align"),
});

// The wide-viewport panel's class list. Only read when !isNarrow (see
// summaryDetailsProps); narrow mode presents through overlay-sheet instead.
const resolvedDetailsClasses = computed(() =>
	cn(
		"w-screen rounded-md border p-4 shadow",
		"border-border bg-surface-elevated backdrop-blur-lg",
		"max-w-lg",
		computedPlacement.value === "above"
			? "absolute bottom-full animate-fade-in-up"
			: "absolute top-full animate-fade-in-down",
		computedAlign.value === "start" ? "inset-s-0" : "inset-e-0",
		"mt-0",
		placementClasses.value,
		{ invisible: isPositioning.value },
		props.detailsClasses,
	),
);

// The summary and panel props forwarded to summary-details.
const summaryDetailsProps = computed(() => ({
	...attrs,
	class: cn(!isNarrow.value && "relative", !isNarrow.value && isOpen.value && "z-50", attrs.class),
	closeWithEscape: !isNarrow.value && props.closeWithEscape,
	detailsClasses: isNarrow.value ? "mt-0" : resolvedDetailsClasses.value,
	summaryClasses: props.summaryClasses,
}));

onClickOutside(
	contentElementRef,
	() => {
		if (!isNarrow.value && isOpen.value && props.closeWithClickOutside) {
			closeFloatingPanel();
		}
	},
	{ ignore: [summaryElementRef] },
);

/**
 * Open the details element and let the presentation watcher activate the
 * appropriate surface.
 */
function handleOpen() {
	isOpen.value = true;

	if (!isNarrow.value) {
		handleFloatingOpen();
	}
}

/**
 * Close the details element and let the presentation watcher stop positioning.
 */
function handleClose() {
	isOpen.value = false;
}

/**
 * Close the owning details element after a user-initiated sheet dismissal.
 */
function handleDismiss() {
	isOpen.value = false;
	closeDetails();

	summaryElementRef.value?.focus?.();
}

/**
 * Close the floating panel.
 */
function closeFloatingPanel() {
	isOpen.value = false;
	closeDetails();
}

/**
 * Dismiss the modal presentation after a navigation link is activated.
 *
 * @param  {MouseEvent}  event
 *     The click event bubbling from the sheet.
 */
function handleSheetClick(event) {
	if (!(event.target instanceof Element) || !event.target.closest("a[href]")) {
		return;
	}

	handleDismiss();
}

watch(
	[isOpen, isNarrow],
	async ([open, narrow], [wasOpen, wasNarrow]) => {
		if (!open) {
			handleFloatingClose();

			return;
		}

		if (narrow) {
			if (!wasNarrow) {
				handleFloatingClose();
			}

			return;
		}

		if (wasNarrow) {
			await nextTick();

			if (isOpen.value && !isNarrow.value) {
				await handleFloatingOpen();
			}
		}
	},
	{ flush: "post" },
);

/**
 * Open the details element.
 */
function openDetails() {
	callComponentMethod(summaryDetailsReference.value, "openDetails");
}

/**
 * Close the details element.
 */
function closeDetails() {
	callComponentMethod(summaryDetailsReference.value, "closeDetails");
}

defineExpose({
	closeDetails,
	openDetails,
});
</script>
