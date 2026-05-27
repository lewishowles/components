import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import ModalDialogTitle from "./modal-dialog-title.vue";

const defaultSlots = { default: "Confirm action" };
const mount = createMount(ModalDialogTitle, { slots: defaultSlots });

describe("modal-dialog-title", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
