<template>
	<div>
		<h2>
			<button type="button" v-bind="{ 'aria-controls': id, 'aria-expanded': isOpen }" @click="toggle">
				<slot name="title" />

				<span class="sr-only">, </span>

				<slot name="introduction" />

				<span v-if="haveIntroduction" class="sr-only">, </span>

				<div>
					<span v-show="!isOpen">
						<slot name="show-section-label">
							{{ showSectionLabel }}
						</slot>
					</span>
					<span v-show="isOpen">
						<slot name="hide-section-label">
							{{ hideSectionLabel }}
						</slot>
					</span>
				</div>
			</button>
		</h2>

		<div v-bind="{ id, hidden: isOpen ? null : 'until-found' }">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { computed, inject, ref, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { nanoid } from "nanoid";

const { registerSection, showSectionLabel, hideSectionLabel } = inject("accordion-group");

const slots = useSlots();
// The internal ID for this accordion section.
const id = nanoid();
// Whether this section is open.
const isOpen = ref(false);
// Whether we have an introduction, which helps us determine how best to format
// the content for screen readers.
const haveIntroduction = computed(() => isNonEmptySlot(slots.slot));

// Register this section with the accordion, allowing it insight into the
// current state, and how to open and close this section.
registerSection({
	isOpen,
	open,
	close,
});

/**
 * Open this section.
 */
function open() {
	isOpen.value = true;
}

/**
 * Open this section.
 */
function close() {
	isOpen.value = false;
}

/**
 * Toggle the open status. We run through the regular open / close methods to
 * ensure that any additional actions or side effects are maintained.
 */
function toggle() {
	if (isOpen.value) {
		close();

		return;
	}

	open();
}

// Use intersection-observer to monitor when the div is found by search
// Save open state in session storage
</script>
