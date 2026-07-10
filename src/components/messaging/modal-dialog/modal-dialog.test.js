import { createDeepMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import ModalDialog from "./modal-dialog.vue";

const defaultSlots = { title: "Modal dialog title" };
const mount = createDeepMount(ModalDialog, { slots: defaultSlots });

describe("modal-dialog", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("dialogRole", () => {
			test("should be alertdialog when variant is alert", () => {
				const wrapper = mount({ variant: "alert" });

				expect(wrapper.vm.dialogRole).toBe("alertdialog");
			});

			test("should be null for the default dialog variant", () => {
				const wrapper = mount({ variant: "dialog" });

				expect(wrapper.vm.dialogRole).toBeNull();
			});
		});

		describe("ariaLabelledby", () => {
			test("should be set when a title slot is provided", () => {
				const wrapper = mount({ slots: { title: "Dialog title" } });

				expect(wrapper.vm.ariaLabelledby).toBeTruthy();
			});

			test("should be null when no title slot is provided", () => {
				const wrapper = mount({ slots: { title: null } });

				expect(wrapper.vm.ariaLabelledby).toBeNull();
			});
		});

		describe("ariaDescribedby", () => {
			test("should be set when variant is alert", () => {
				const wrapper = mount({ variant: "alert" });

				expect(wrapper.vm.ariaDescribedby).toBeTruthy();
			});

			test("should be null for the default dialog variant", () => {
				const wrapper = mount();

				expect(wrapper.vm.ariaDescribedby).toBeNull();
			});
		});

		describe("baseModalProps", () => {
			test("forwards inert to base-modal", () => {
				const wrapper = mount({ inert: true });

				expect(wrapper.vm.baseModalProps.inert).toBe(true);
			});

			test("defaults inert to false", () => {
				const wrapper = mount();

				expect(wrapper.vm.baseModalProps.inert).toBe(false);
			});
		});
	});

	describe("Events", () => {
		test("re-emits dialog:close when base-modal closes", async () => {
			const wrapper = mount();

			await wrapper.find('[data-test="modal-dialog-close"]').trigger("click");

			expect(wrapper.emitted("dialog:close")).not.toBeUndefined();
		});
	});
});
