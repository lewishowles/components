<template>
	<dialog ref="dialog" class="fixed start-1/2 top-1/2 -translate-1/2 w-full max-w-2xl rounded-md border border-grey-300 p-12 text-current shadow-2xl dark:border-white/10 dark:bg-grey-950/80 backdrop-blur-xl" data-test="modal-dialog">
		<ui-button class="absolute end-0 top-0 me-4 mt-4 rounded-sm p-3 hocus:bg-grey-200 dark:hocus:bg-white/20" data-test="modal-dialog-close" @click="closeDialog">
			<icon-cross />

			<span class="sr-only">
				<slot name="close-dialog-label">
					Close dialog
				</slot>
			</span>
		</ui-button>

		<slot />
	</dialog>
</template>

<script setup>
import { onMounted, useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * Whether the dialog should open itself immediately. This is true by
	 * default for use with `modal-controller`, but will likely need to be set
	 * to false if used directly.
	 */
	initiallyOpen: {
		type: Boolean,
		default: true,
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

const emit = defineEmits(["dialog:close"]);
// A reference to the dialog itself.
const dialog = useTemplateRef("dialog");

onMounted(() => {
	initialiseDialog();
});

/**
 * Initialise our dialog, opening it if required.
 */
function initialiseDialog() {
	if (props.initiallyOpen !== true) {
		return;
	}

	openDialog();
}

/**
 * Open the dialog.
 */
function openDialog() {
	if (!dialog.value) {
		return;
	}

	runComponentMethod(dialog.value, "showModal");

	if (props.focusDialogOnOpen !== true) {
		return;
	}

	runComponentMethod(dialog.value, "focus");
}

/**
 * Close the dialog.
 */
function closeDialog() {
	if (!dialog.value) {
		return;
	}

	runComponentMethod(dialog.value, "close");

	emit("dialog:close");
}

defineExpose({
	open: openDialog,
	close: closeDialog,
});
</script>
