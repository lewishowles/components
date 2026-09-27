<template>
	<dialog
		ref="dialog"
		aria-modal="true"
		tabindex="-1"
		v-bind="{
			...attributes,
			'aria-labelledby': ariaLabelledby,
			'aria-describedby': ariaDescribedby,
			inert,
			role: dialogRole,
		}"
		:class="dialogClasses"
		data-component="base-modal"
		data-part="sheet"
		data-test="modal-dialog"
		@close="handleClose"
	>
		<div class="modal-dialog-header">
			<ui-button
				class="button--ghost"
				icon-start="icon-cross"
				icon-only
				data-part="close-button"
				data-test="modal-dialog-close"
				@click="closeDialog"
			>
				<slot name="close-dialog-label">Close dialog</slot>
			</ui-button>
		</div>

		<div class="modal-dialog-body">
			<slot
				v-bind="{
					isOpen,
					open: openDialog,
					close: closeDialog,
					titleId: ariaLabelledby,
					descriptionId: ariaDescribedby,
				}"
			/>
		</div>

		<slot name="actions" />
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
	 * Whether to always focus the dialog itself on open. Defaults to false so
	 * that an autofocus element inside the dialog (typically the title) receives
	 * focus, letting screen readers announce the dialog purpose before reaching
	 * the close button. A dialog with no autofocus element is focused itself.
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

// Whether the next native close event comes from closeDialog. Chromium fires
// that event after closeDialog has already handled the close, so it is
// skipped instead of being handled twice.
let isProgrammaticClose = false;

// Whether the dialog has closed but dialog:close is still waiting for the exit
// animation to finish.
let isClosePending = false;

// Fallthrough attributes aside from class, applied explicitly since
// inheritAttrs is disabled so class can be merged via cn() instead.
const attributes = computed(() => {
	const { class: _omitted, ...rest } = attrs;

	return rest;
});

// Root dialog classes. Merged via cn() so a consumer's own classes reliably
// override defaults like padding or overflow, rather than competing with them
// as separate same-layer Tailwind utilities.
const dialogClasses = computed(() => cn("reveal-fade-up", { hidden: props.inert }, attrs.class));

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
 * Open the dialog and decide where initial focus lands: the dialog itself when
 * focusDialogOnOpen is set or no autofocus element exists inside it, otherwise
 * the autofocus element.
 */
function openDialog() {
	if (!dialog.value) {
		return;
	}

	// Report a close that is still waiting on its exit animation before
	// reopening, so the owner isn't told the reopened dialog has closed.
	emitPendingClose();

	callComponentMethod(dialog.value, "showModal");

	isOpen.value = true;

	if (props.focusDialogOnOpen !== true && dialog.value.querySelector("[autofocus]")) {
		return;
	}

	callComponentMethod(dialog.value, "focus");
}

/**
 * Close the dialog and tell the owner it has closed. Does nothing if the
 * dialog is already closed.
 */
function closeDialog() {
	if (!dialog.value || !isOpen.value) {
		return;
	}

	isProgrammaticClose = true;

	callComponentMethod(dialog.value, "close");

	finishClose();
}

/**
 * Tell the owner the dialog has closed when the browser closes it, such as
 * when the user presses Escape.
 */
function handleClose() {
	if (isProgrammaticClose) {
		isProgrammaticClose = false;

		return;
	}

	if (!isOpen.value) {
		return;
	}

	finishClose();
}

/**
 * Mark the dialog as closed, then emit dialog:close once the exit animation
 * finishes, or straight away when nothing is animating. Both ways of closing
 * call this, so the event fires once for each close.
 */
function finishClose() {
	isOpen.value = false;
	isClosePending = true;

	// Only animations with an end are awaited, so a looping animation on the
	// dialog, such as a pulse class added by the user, can't hold back the event.
	const animations = (dialog.value?.getAnimations?.() ?? []).filter(
		(animation) => animation.effect?.getComputedTiming().endTime !== Infinity,
	);

	if (animations.length === 0) {
		emitPendingClose();

		return;
	}

	Promise.allSettled(animations.map((animation) => animation.finished)).then(emitPendingClose);
}

/**
 * Emit dialog:close if a close is still waiting to be reported. Reopening the
 * dialog reports it early, so the exit animation then has nothing to report.
 * If code closes, reopens and closes the dialog in one go, the second close
 * may be reported before its own exit finishes. It is still reported once.
 */
function emitPendingClose() {
	if (!isClosePending) {
		return;
	}

	isClosePending = false;
	emit("dialog:close");
}

defineExpose({
	isOpen,
	open: openDialog,
	close: closeDialog,
});
</script>
