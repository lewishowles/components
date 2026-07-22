<template>
	<dialog
		ref="dialog"
		aria-modal="true"
		v-bind="{
			...attributes,
			'aria-labelledby': ariaLabelledby,
			'aria-describedby': ariaDescribedby,
			inert,
			role: dialogRole,
		}"
		:class="dialogClasses"
		data-component="base-modal"
		data-test="modal-dialog"
	>
		<ui-button
			class="button--ghost absolute inset-e-0 top-0 me-4 mt-4"
			icon-start="icon-cross"
			icon-only
			data-part="close-button"
			data-test="modal-dialog-close"
			@click="closeDialog"
		>
			<slot name="close-dialog-label">Close dialog</slot>
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
import { cn } from "@/utilities/cn.js";
import { computed, onMounted, ref, useAttrs, useTemplateRef } from "vue";
import { callComponentMethod } from "@lewishowles/helpers/vue";

defineOptions({ inheritAttrs: false });

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

const attrs = useAttrs();
// A reference to the dialog element.
const dialog = useTemplateRef("dialog");
// Whether the dialog is currently open.
const isOpen = ref(false);

// Fallthrough attributes aside from class, applied explicitly since
// inheritAttrs is disabled so class can be merged via cn() instead.
const attributes = computed(() => {
	const { class: _omitted, ...rest } = attrs;

	return rest;
});

// Root dialog classes. Merged via cn() so a consumer's own classes reliably
// override defaults like padding or overflow, rather than competing with them
// as separate same-layer Tailwind utilities.
const dialogClasses = computed(() =>
	cn("animate-fade-in-up", { hidden: props.inert }, attrs.class),
);

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

	callComponentMethod(dialog.value, "showModal");

	isOpen.value = true;

	if (props.focusDialogOnOpen !== true) {
		return;
	}

	callComponentMethod(dialog.value, "focus");
}

/**
 * Close the dialog.
 */
function closeDialog() {
	if (!dialog.value) {
		return;
	}

	callComponentMethod(dialog.value, "close");

	isOpen.value = false;

	emit("dialog:close");
}

defineExpose({
	isOpen,
	open: openDialog,
	close: closeDialog,
});
</script>
