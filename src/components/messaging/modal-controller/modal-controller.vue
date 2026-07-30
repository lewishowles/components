<template>
	<Teleport to="body">
		<component
			v-for="modal in modals"
			:key="modal.id"
			:is="modal.component"
			v-bind="{
				...modal.props,
				onClose: () => closeModal(modal),
				inert: modal.id !== currentModal?.id,
			}"
		/>
	</Teleport>
</template>

<script setup>
/**
 * Display modals as defined in `use-modal-dialog`. Modals are defined
 * programmatically, so each pushed component is expected to be fully
 * self-contained: it renders its own `modal-dialog`, forwards the received
 * `inert` prop to it, and calls the received `onClose` prop when its dialog
 * emits `dialog:close` (covering the built-in close button, Escape, and any
 * confirm/cancel actions of its own).
 *
 * All modals in the stack stay in the DOM. Non-current modals receive the
 * `inert` prop so they are visible but not interactive, which preserves
 * focus context when a stacked modal closes.
 */
import { computed } from "vue";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyArray, lastDefined } from "@lewishowles/helpers/array";
import { useModalDialog } from "@/composables/use-modal-dialog/use-modal-dialog";

const { closeModal: closeModalById, modals } = useModalDialog();

// The topmost modal: the one the user is currently interacting with.
const currentModal = computed(() => {
	if (!isNonEmptyArray(modals.value)) {
		return null;
	}

	return lastDefined(modals.value);
});

/**
 * Close a modal: runs any onClose the caller supplied to openModal, then
 * removes that entry from the stack, so a caller can react to a modal closing
 * for any reason without needing to manage the stack themselves.
 *
 * @param  {object}  modal
 *     The modal stack entry to close.
 */
function closeModal(modal) {
	if (isFunction(modal.props?.onClose)) {
		modal.props.onClose();
	}

	closeModalById(modal.id);
}
</script>
