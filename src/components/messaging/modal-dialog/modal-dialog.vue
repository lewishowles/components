<template>
	<base-modal
		ref="dialog"
		v-bind="baseModalProps"
		data-component="modal-dialog"
		:data-state="props.variant"
	>
		<template #close-dialog-label>
			<slot name="close-dialog-label" />
		</template>

		<modal-dialog-title v-if="haveTitle" data-part="title">
			<slot name="title" />
		</modal-dialog-title>

		<conditional-wrapper :id="descriptionId" :wrap="props.variant === 'alert'">
			<slot v-bind="{ titleId, descriptionId }" />
		</conditional-wrapper>

		<modal-dialog-actions v-if="haveActions" data-part="actions">
			<slot name="actions" />
		</modal-dialog-actions>
	</base-modal>
</template>

<script setup>
import { computed, onMounted, provide, useAttrs, useId, useSlots, useTemplateRef } from "vue";
import { isNonEmptySlot, runComponentMethod } from "@lewishowles/helpers/vue";

import ConditionalWrapper from "@/components/general/conditional-wrapper/conditional-wrapper.vue";

const props = defineProps({
	/**
	 * Whether the dialog should open itself immediately.
	 */
	initiallyOpen: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to focus the dialog itself on open, or the first focusable
	 * element within it. Defaults to false so the autofocus title receives
	 * focus first, announcing the dialog purpose before the close button.
	 */
	focusDialogOnOpen: {
		type: Boolean,
		default: false,
	},

	/**
	 * The variant of this dialog. "alert" renders role="alertdialog" and is
	 * intended for dialogs that interrupt the user and require a response.
	 */
	variant: {
		type: String,
		default: "dialog",
		validator: (value) => ["dialog", "alert"].includes(value),
	},
});

const attrs = useAttrs();
// A reference to the base-modal component.
const dialog = useTemplateRef("dialog");
const slots = useSlots();

// A stable id for the title element, provided to modal-dialog-title via
// injection so it can apply it as its own id.
const titleId = useId();
// A stable id consumers can apply to a description element, then read back
// via the descriptionId slot prop for aria-describedby wiring.
const descriptionId = useId();

// Whether we have content for the title slot.
const haveTitle = computed(() => isNonEmptySlot(slots.title));
// Whether we have content for the actions slot.
const haveActions = computed(() => isNonEmptySlot(slots.actions));
// The ARIA role override — "alertdialog" for alert variants, null otherwise
// (preserving the native implicit "dialog" role).
const dialogRole = computed(() => (props.variant === "alert" ? "alertdialog" : null));
// aria-labelledby points to the title element when a title slot is populated.
const ariaLabelledby = computed(() => (haveTitle.value ? titleId : null));
// aria-describedby points to the description element for alert dialogs.
const ariaDescribedby = computed(() => (props.variant === "alert" ? descriptionId : null));

// Props forwarded to base-modal, keeping variant out of the spread so it
// does not reach the underlying <dialog> element as an unknown attribute.
const baseModalProps = computed(() => ({
	initiallyOpen: props.initiallyOpen,
	focusDialogOnOpen: props.focusDialogOnOpen,
	dialogRole: dialogRole.value,
	ariaLabelledby: ariaLabelledby.value,
	ariaDescribedby: ariaDescribedby.value,
}));

// Provide the titleId so modal-dialog-title can inject it and apply it as
// its own id, completing the aria-labelledby link.
provide("modal-dialog-title-id", titleId);

// Validate that the dialog has an accessible label.
onMounted(() => {
	if (import.meta.env.DEV && !haveTitle.value && !attrs["aria-labelledby"]) {
		console.warn(
			"[modal-dialog] No accessible label found. Provide a `title` slot, or pass `aria-labelledby`.",
		);
	}
});

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
