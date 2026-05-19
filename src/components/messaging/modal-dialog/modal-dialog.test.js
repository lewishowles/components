import { createDeepMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ModalDialog from "./modal-dialog.vue";

const mount = createDeepMount(ModalDialog);

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
				const wrapper = mount();

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
	});
});
