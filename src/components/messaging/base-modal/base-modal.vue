<template>
	<dialog
		ref="dialog"
		aria-modal="true"
		v-bind="{
			'aria-labelledby': ariaLabelledby,
			'aria-describedby': ariaDescribedby,
			inert,
			role: dialogRole,
		}"
		class="border-border-strong dark:bg-grey-950/80 fixed inset-s-1/2 top-1/2 w-full max-w-2xl -translate-1/2 rounded-lg border p-12 text-current shadow-2xl backdrop-blur-xl dark:border-white/10"
		:class="{ hidden: inert }"
		data-component="base-modal"
		data-test="modal-dialog"
	>
		<ui-button
			class="hocus:bg-grey-200 dark:hocus:bg-white/20 absolute inset-e-0 top-0 me-4 mt-4 rounded-lg p-3"
			data-part="close-button"
			data-test="modal-dialog-close"
			@click="closeDialog"
		>
			<icon-cross />

			<span class="sr-only">
				<slot name="close-dialog-label">Close dialog</slot>
			</span>
		</ui-button>

		<slot
			v-bind="{
				isOpen,
				open: openDialog,
				close: closeDialog,
				titleId: ariaLabelledby,
				descriptionId: ariaDescribedby,
			}"
		/>
	</dialog>
</template>

<script setup>
import { onMounted, ref, useTemplateRef } from "vue";
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
	 * element within it. Defaults to false so that the autofocus element inside
	 * the dialog (typically the title) receives focus instead, letting screen
	 * readers announce the dialog purpose before reaching the close button.
	 */
	focusDialogOnOpen: {
		type: Boolean,
		default: false,
	},

	/**
	 * An explicit ARIA role for the dialog element. Null preserves the native
	 * implicit "dialog" role. Set to "alertdialog" for dialogs that require
	 * immediate user attention.
	 */
	dialogRole: {
		type: String,
		default: null,
	},

	/**
	 * The id of the element that labels this dialog, used for aria-labelledby.
	 */
	ariaLabelledby: {
		type: String,
		default: null,
	},

	/**
	 * The id of the element that describes this dialog, used for
	 * aria-describedby.
	 */
	ariaDescribedby: {
		type: String,
		default: null,
	},

	/**
	 * Whether this dialog is inert (disabled and not interactive). Used when
	 * stacking modals to make background modals visually present but not
	 * focusable or interactive.
	 */
	inert: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["dialog:close"]);
// A reference to the dialog element.
const dialog = useTemplateRef("dialog");
// Whether the dialog is currently open.
const isOpen = ref(false);

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

	isOpen.value = true;

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

	isOpen.value = false;

	emit("dialog:close");
}

defineExpose({
	isOpen,
	open: openDialog,
	close: closeDialog,
});
</script>
