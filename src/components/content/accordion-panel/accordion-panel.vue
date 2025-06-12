<template>
	<div data-test="accordion-panel">
		<component :is="headingLevel" class="py-6" data-test="accordion-panel-title">
			<button type="button" class="group flex flex-col items-start" v-bind="{ 'aria-controls': id, 'aria-expanded': isVisible }" data-test="accordion-panel-button" @click="toggle">
				<span class="mb-1 text-2xl font-bold text-grey-950">
					<slot name="title" />
				</span>

				<span class="sr-only">, </span>

				<span class="mb-2">
					<slot name="introduction" />
				</span>

				<span v-if="haveIntroduction" class="sr-only">, </span>

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
		</component>

		<div v-bind="{ id, hidden: isVisible ? null : 'until-found' }" :class="{ 'pb-6': isVisible }" data-test="accordion-panel-content">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { computed, inject, ref, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { nanoid } from "nanoid";

const { registerPanel, headingLevel, showPanelLabel, hidePanelLabel } = inject("accordion-group");

const slots = useSlots();
// The internal ID for this accordion panel.
const id = nanoid();
// Whether this panel is visible.
const isVisible = ref(false);
// The icon to show depending on the visibility of this panel.
const statusIcon = computed(() => (isVisible.value ? "icon-chevron-up-circled" : "icon-chevron-down-circled"));
// Whether we have an introduction, which helps us determine how best to format
// the content for screen readers.
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));

// Register this panel with the accordion, allowing it insight into the
// current state, and how to show and hide this panel.
registerPanel({
	isVisible,
	show,
	hide,
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

// Use intersection-observer to monitor when the div is found by search
// Save visible state in session storage
</script>
