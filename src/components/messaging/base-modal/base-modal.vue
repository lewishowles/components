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

		<h2 v-if="haveTitle" class="mb-6 text-2xl font-bold text-grey-950 dark:text-grey-50">
			<slot name="title" />
		</h2>

		<slot />

		<div v-if="haveActions" class="mt-12 flex items-center gap-6 border-t border-grey-200 dark:border-white/20 pt-6">
			<slot name="actions" />
		</div>
	</dialog>
</template>

<script setup>
import { runComponentMethod } from "@lewishowles/helpers/vue";
import { useTemplateRef } from "vue";

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

const emit = defineEmits(["@dialog:close"]);
// A reference to the dialog itself.
const dialog = useTemplateRef("dialog");

initialiseDialog();

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

	emit("@dialog:close");
}

defineExpose({
	open: openDialog,
	close: closeDialog,
});
</script>
