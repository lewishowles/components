<template>
	<div>
		<ui-button data-test="stacking-test-open-first" @click="openFirstModal">
			Open first modal
		</ui-button>

		<modal-controller />
	</div>
</template>

<script setup>
/**
 * A fixture for testing modal-controller's stacking behaviour. Opens two
 * modals in sequence so that the inert attribute and focus restoration can
 * be verified.
 */
import { defineComponent, h, markRaw } from "vue";
import useModalDialog from "@/composables/use-modal-dialog/use-modal-dialog";

import ModalController from "../modal-controller.vue";

const { openModal, _clearModals } = useModalDialog();

/* eslint-disable vue/one-component-per-file */

// Minimal identifiable modals to test stacking.
const SecondModal = markRaw(
	defineComponent({
		name: "SecondModal",
		props: {
			onClose: {
				type: Function,
				default: null,
			},
		},
		setup(props) {
			return () =>
				h("div", [
					h("p", { "data-test": "stacking-test-second-content" }, "Second modal"),
					h(
						"ui-button",
						{
							"data-test": "stacking-test-close-second",
							onClick: props.onClose,
						},
						"Close second",
					),
				]);
		},
	}),
);

const FirstModal = markRaw(
	defineComponent({
		name: "FirstModal",
		setup() {
			const { openModal } = useModalDialog();

			function openSecondModal() {
				openModal(SecondModal);
			}

			return () =>
				h("div", [
					h("p", { "data-test": "stacking-test-first-content" }, "First modal"),
					h(
						"ui-button",
						{
							"data-test": "stacking-test-open-second",
							onClick: openSecondModal,
						},
						"Open second modal",
					),
				]);
		},
	}),
);

_clearModals();

/**
 * Open the first modal.
 */
function openFirstModal() {
	openModal(FirstModal);
}
</script>
