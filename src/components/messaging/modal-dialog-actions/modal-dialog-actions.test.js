import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
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
