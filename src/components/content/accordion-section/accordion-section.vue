<template>
	<div>
		<h2>
			<button type="button" v-bind="{ 'aria-controls': id, 'aria-expanded': isOpen }" @click="toggle">
				<slot name="title" />
				<span>, </span>
				<slot name="introduction" />
				<span>, </span>
				Show / Hide
			</button>
		</h2>
		<div v-bind="{ id, hidden: isOpen ? null : 'until-found' }">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { inject, ref } from "vue";
import { nanoid } from "nanoid";

const { registerSection } = inject("accordion-group");

// The internal ID for this accordion section.
const id = nanoid();
// Whether this section is open.
const isOpen = ref(false);

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
