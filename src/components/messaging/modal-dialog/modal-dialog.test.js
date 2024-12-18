import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ModalDialog from "./modal-dialog.vue";

const mount = createMount(ModalDialog);

describe("modal-dialog", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("closeDialog", () => {
			test("should emit the correct event", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(wrapper.emitted("@dialog:close")).toBeUndefined();

				vm.close();

				expect(wrapper.emitted("@dialog:close").length).toBe(1);
			});
		});
	});
});
