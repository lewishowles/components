import { beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { createMount } from "@lewishowles/testing/vue";
import { useModalDialog } from "@/composables/use-modal-dialog/use-modal-dialog.js";
import ModalController from "./modal-controller.vue";

const mount = createMount(ModalController);

describe("modal-controller", () => {
	beforeEach(() => {
		const { _clearModals } = useModalDialog();

		_clearModals();
	});

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

	describe("closeModal", () => {
		test("calls the caller-supplied onClose before removing the modal from the stack", () => {
			const wrapper = mount();
			const { openModal } = useModalDialog();

			const onClose = vi.fn(() => {
				expect(wrapper.vm.modals).toHaveLength(1);
			});

			openModal({ name: "my-component" }, { onClose });

			const [modal] = wrapper.vm.modals;

			wrapper.vm.closeModal(modal);

			expect(onClose).toHaveBeenCalledOnce();
			expect(wrapper.vm.modals).toHaveLength(0);
		});

		test("removes the foreground modal when no onClose was supplied", () => {
			const wrapper = mount();
			const { openModal } = useModalDialog();

			openModal({ name: "background-modal" });
			openModal({ name: "foreground-modal" });

			const [, modal] = wrapper.vm.modals;

			expect(() => wrapper.vm.closeModal(modal)).not.toThrow();
			expect(wrapper.vm.modals).toEqual([
				{
					id: expect.any(Number),
					component: { name: "background-modal" },
					props: {},
				},
			]);
		});

		test("removes a background modal without closing the foreground modal", () => {
			const wrapper = mount();
			const { openModal } = useModalDialog();

			openModal({ name: "background-modal" });
			openModal({ name: "foreground-modal" });

			const [backgroundModal, foregroundModal] = wrapper.vm.modals;

			wrapper.vm.closeModal(backgroundModal);

			expect(wrapper.vm.modals).toEqual([foregroundModal]);
		});
	});
});
