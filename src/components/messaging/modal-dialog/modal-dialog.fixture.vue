<script setup>
// A fixture for testing modal-dialog open/close flows and focus management.
import { useTemplateRef } from "vue";
import { callComponentMethod } from "@lewishowles/helpers/vue";

import ModalDialog from "./modal-dialog.vue";

const dialogComponent = useTemplateRef("dialogComponent");

function openDialog() {
	callComponentMethod(dialogComponent.value, "open");
}

function closeDialog() {
	callComponentMethod(dialogComponent.value, "close");
}
</script>

<template>
	<div>
		<ui-button data-test="modal-dialog-interaction-test-open" @click="openDialog">
			Open dialog
		</ui-button>

		<modal-dialog ref="dialogComponent">
			<template #title>Confirm action</template>

			<ui-button data-test="modal-dialog-interaction-test-confirm">Confirm</ui-button>

			<ui-button data-test="modal-dialog-interaction-test-close" @click="closeDialog">
				Close
			</ui-button>
		</modal-dialog>
	</div>
</template>
