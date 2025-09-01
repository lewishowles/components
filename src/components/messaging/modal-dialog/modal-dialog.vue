<template>
	<base-modal ref="dialog" v-bind="props">
		<template #close-dialog-label>
			<slot name="close-dialog-label" />
		</template>

		<h2 v-if="haveTitle" class="mb-6 text-2xl font-bold text-grey-950 dark:text-grey-50">
			<slot name="title" />
		</h2>

		<slot />

		<div v-if="haveActions" class="mt-12 flex items-center gap-6 border-t border-grey-200 dark:border-white/20 pt-6">
			<slot name="actions" />
		</div>
	</base-modal>
</template>

<script setup>
import { computed, useSlots, useTemplateRef } from "vue";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * Whether the dialog should be open when it loads.
	 */
	initiallyOpen: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to focus the dialog itself on open, or the first focusable
	 * element within it.
	 */
	focusDialogOnOpen: {
		type: Boolean,
		default: true,
	},
});

// A reference to the dialog itself.
const dialog = useTemplateRef("dialog");
const slots = useSlots();
// Whether we have content for the title slot, allowing us to hide the wrapper
// if it is not needed.
const haveTitle = computed(() => isNonEmptySlot(slots.title));
// Whether we have content for the actions slot, allowing us to hide the wrapper
// if it is not needed.
const haveActions = computed(() => isNonEmptySlot(slots.actions));

runComponentMethod(dialog.value, "initialiseDialog");

/**
 * Open the dialog.
 */
function openDialog() {
	runComponentMethod(dialog.value, "open");
}

/**
 * Close the dialog.
 */
function closeDialog() {
	runComponentMethod(dialog.value, "close");
}

defineExpose({
	open: openDialog,
	close: closeDialog,
});
</script>
