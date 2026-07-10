<template>
	<modal-dialog v-bind="{ inert }" @dialog:close="onClose?.()">
		<template #title>#{{ modalId }}</template>

		<div class="flex flex-col gap-4">
			<p>
				Multiple copies of this modal dialog can be opened to display the last-in first-out system.
			</p>

			<form-field type="text">
				Text input

				<template #help>
					The text in this input should persist when further modals are closed.
				</template>
			</form-field>

			<ui-button class="button--primary self-start" @click="displayModal">Open another</ui-button>
		</div>
	</modal-dialog>
</template>

<script setup>
import InceptionModal from "./inception-modal.vue";
import { useModalDialog } from "@/composables/use-modal-dialog/use-modal-dialog";

const props = defineProps({
	/**
	 * The ID of this modal, allowing multiple copies of the same modal to show
	 * a different ID to differentiate them.
	 */
	modalId: {
		type: Number,
		default: 1,
	},

	/**
	 * Whether this modal is inert, provided by modal-controller when a modal
	 * further up the stack is currently active.
	 */
	inert: {
		type: Boolean,
		default: false,
	},

	/**
	 * Called when this modal should close, provided by modal-controller.
	 */
	onClose: {
		type: Function,
		default: null,
	},
});

const { openModal } = useModalDialog();

let localModalId = props.modalId;

function displayModal() {
	localModalId++;

	openModal(InceptionModal, { modalId: localModalId });
}
</script>
