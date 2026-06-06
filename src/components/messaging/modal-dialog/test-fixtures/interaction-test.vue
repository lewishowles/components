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

<script setup>
/**
 * A minimal interaction fixture used by modal-dialog.cy.js. It provides an
 * open trigger, the dialog itself, and two buttons inside the dialog so that
 * focus-management and close flows can be verified.
 */
import { useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

import ModalDialog from "../modal-dialog.vue";

// A reference to the modal-dialog component, used to open and close it
// programmatically.
const dialogComponent = useTemplateRef("dialogComponent");

/**
 * Open the modal dialog.
 */
function openDialog() {
	runComponentMethod(dialogComponent.value, "open");
}

/**
 * Close the modal dialog.
 */
function closeDialog() {
	runComponentMethod(dialogComponent.value, "close");
}
</script>
