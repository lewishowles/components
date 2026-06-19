import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import ModalDialogActions from "./modal-dialog-actions.vue";

const mount = createMount(ModalDialogActions);

describe("modal-dialog-actions", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
