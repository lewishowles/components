import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ModalDialogTitle from "./modal-dialog-title.vue";

const mount = createMount(ModalDialogTitle);

describe("modal-dialog-title", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
