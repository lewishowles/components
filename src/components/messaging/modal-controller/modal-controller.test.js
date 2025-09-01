import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ModalController from "./modal-controller.vue";
import useModalDialog from "@/composables/use-modal-dialog/use-modal-dialog.js";

const mount = createMount(ModalController);

describe("modal-controller", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		test("should not detect a modal if one is not present", () => {
			const wrapper = mount();
			const vm = wrapper.vm;

			expect(vm.currentModal).toBe(null);
		});

		test("should detect an existing modal", () => {
			const wrapper = mount();
			const vm = wrapper.vm;

			const { openModal } = useModalDialog();

			expect(vm.currentModal).toBe(null);

			openModal({ name: "my-component" }, { title: "prop title" });

			expect(vm.currentModal).toEqual({
				id: expect.any(Number),
				component: { name: "my-component" },
				props: { title: "prop title" },
			});
		});
	});
});
