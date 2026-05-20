<template>
	<div data-test="accordion-panel">
		<component :is="headingLevel" class="py-6" data-test="accordion-panel-title">
			<button
				type="button"
				class="group flex flex-col items-start"
				v-bind="{ 'aria-controls': id, 'aria-expanded': isVisible, 'aria-labelledby': titleId }"
				data-part="accordion-trigger"
				data-test="accordion-panel-button"
				@click="toggle"
			>
				<span :id="titleId" class="mb-1 text-2xl font-bold text-grey-950 dark:text-grey-50">
					<slot name="title" />
				</span>

				<div class="inline-flex items-center gap-2 text-purple-800 group-hocus:underline dark:text-purple-300">
					<component :is="statusIcon" class="size-text" />

					<span v-show="!isVisible" class="inline-flex items-center gap-2">
						<slot name="show-panel-label">
							{{ showPanelLabel }}
						</slot>
					</span>
					<span v-show="isVisible" class="inline-flex items-center gap-2">
						<slot name="hide-panel-label">
							{{ hidePanelLabel }}
						</slot>
					</span>
				</div>
			</button>

			<span v-if="haveIntroduction" class="mb-2 block">
				<slot name="introduction" />
			</span>
		</component>

		<div
			ref="contentRef"
			v-bind="contentRegionProps"
			:class="{ 'pb-6': isVisible }"
			data-test="accordion-panel-content"
		>
			<slot />
		</div>
	</div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, useId, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const { headingLevel, hidePanelLabel, panelCount = ref(0), registerPanel, showPanelLabel } = inject("accordion-group", {});

const slots = useSlots();
// A ref to the panel content element, used to listen for find-in-page reveals.
const contentRef = ref(null);
// The internal ID for this accordion panel.
const id = useId();
// A stable ID for the title span, referenced by the button and the region.
const titleId = useId();
// Whether this panel is visible.
const isVisible = ref(false);
// The icon to show depending on the visibility of this panel.
const statusIcon = computed(() => (isVisible.value ? "icon-chevron-up-circled" : "icon-chevron-down-circled"));
// Whether this panel should use role="region". Skipped above 6 panels to avoid
// cluttering the landmark list.
const useRegion = computed(() => panelCount.value <= 6);
// Whether we have an introduction to show below the trigger button.
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));

// Accessibility attributes for the panel content region.
const contentRegionProps = computed(() => ({
	id,
	"role": useRegion.value ? "region" : null,
	"aria-labelledby": useRegion.value ? titleId : null,
	"hidden": isVisible.value ? null : "until-found",
}));

// Register this panel with the accordion, allowing it insight into the
// current state, and how to show and hide this panel.
registerPanel({
	isVisible,
	show,
	hide,
});

onMounted(() => {
	contentRef.value?.addEventListener("beforematch", show);
});

onBeforeUnmount(() => {
	contentRef.value?.removeEventListener("beforematch", show);
});

/**
 * Open this panel.
 */
function show() {
	isVisible.value = true;
}

/**
 * Open this panel.
 */
function hide() {
	isVisible.value = false;
}

/**
 * Toggle the visible status. We run through the regular show / hide methods to
 * ensure that any additional actions or side effects are maintained.
 */
function toggle() {
	if (isVisible.value) {
		hide();

		return;
	}

	show();
}

</script>
