<template>
	<modal-dialog ref="dialog" variant="alert" @dialog:close="onClose?.()">
		<template #title>
			<slot name="title" />
		</template>

		<slot />

		<template #actions>
			<ui-button
				v-bind="{ class: danger ? 'button--danger' : 'button--primary' }"
				data-test="confirm-dialog-confirm"
				@click="handleConfirm"
			>
				<slot name="confirm-button-label">Confirm</slot>
			</ui-button>

			<ui-button class="button--muted" data-test="confirm-dialog-cancel" @click="handleCancel">
				<slot name="cancel-button-label">Cancel</slot>
			</ui-button>
		</template>
	</modal-dialog>
</template>

<script setup>
import { useTemplateRef } from "vue";
import { callComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * Whether the confirm action is destructive, styling the confirm button
	 * to match.
	 */
	danger: {
		type: Boolean,
		default: false,
	},

	/**
	 * Called when the confirm action is chosen.
	 */
	onConfirm: {
		type: Function,
		default: null,
	},

	/**
	 * Called when this dialog closes, for any reason: confirming, cancelling,
	 * the built-in close button, or Escape.
	 */
	onClose: {
		type: Function,
		default: null,
	},
});

// A reference to the underlying modal-dialog.
const dialog = useTemplateRef("dialog");

/**
 * Close the dialog without confirming.
 */
function handleCancel() {
	callComponentMethod(dialog.value, "close");
}

/**
 * Run the confirm action, then close the dialog.
 */
function handleConfirm() {
	props.onConfirm?.();

	callComponentMethod(dialog.value, "close");
}
</script>
