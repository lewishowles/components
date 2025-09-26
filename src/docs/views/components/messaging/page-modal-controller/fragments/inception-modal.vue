<template>
	<div class="flex flex-col gap-4">
		<p class="text-4xl font-bold">
			#{{ modalId }}
		</p>

		<p>Multiple copies of this modal dialog can be opened to display the last-in first-out system.</p>

		<form-field type="text">
			Text input

			<template #help>
				The text in this input should persist when further modals are closed.
			</template>
		</form-field>

		<ui-button class="button--primary self-start" @click="displayModal">
			Open another
		</ui-button>
	</div>
</template>

<script setup>
import InceptionModal from "./inception-modal.vue";
import useModalDialog from "@/composables/use-modal-dialog/use-modal-dialog";

const props = defineProps({
	/**
	 * The ID of this modal, allowing multiple copies of the same modal to show
	 * a different ID to differentiate them.
	 */
	modalId: {
		type: Number,
		default: 1,
	},
});

const { openModal } = useModalDialog();

let localModalId = props.modalId;

function displayModal() {
	localModalId++;

	openModal(InceptionModal, { modalId: localModalId });
}

</script>
