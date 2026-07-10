import { createDeepMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";
import ConfirmDialog from "./confirm-dialog.vue";

const defaultSlots = { title: "Delete this vehicle?" };
const mount = createDeepMount(ConfirmDialog, { slots: defaultSlots });

describe("confirm-dialog", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("renders default confirm and cancel labels", () => {
			const wrapper = mount();

			expect(wrapper.text()).toContain("Confirm");
			expect(wrapper.text()).toContain("Cancel");
		});

		test("renders custom confirm and cancel slot content", () => {
			const wrapper = mount({
				slots: {
					...defaultSlots,
					"confirm-button-label": "Delete vehicle",
					"cancel-button-label": "Keep vehicle",
				},
			});

			expect(wrapper.text()).toContain("Delete vehicle");
			expect(wrapper.text()).toContain("Keep vehicle");
		});
	});

	describe("Confirming", () => {
		test("calls onConfirm, then onClose, when the confirm button is clicked", async () => {
			const calls = [];
			const onConfirm = vi.fn(() => calls.push("confirm"));
			const onClose = vi.fn(() => calls.push("close"));
			const wrapper = mount({ onConfirm, onClose });

			await wrapper.find('[data-test="confirm-dialog-confirm"]').trigger("click");

			expect(calls).toEqual(["confirm", "close"]);
		});
	});

	describe("Cancelling", () => {
		test("calls onClose without calling onConfirm when the cancel button is clicked", async () => {
			const onConfirm = vi.fn();
			const onClose = vi.fn();
			const wrapper = mount({ onConfirm, onClose });

			await wrapper.find('[data-test="confirm-dialog-cancel"]').trigger("click");

			expect(onConfirm).not.toHaveBeenCalled();
			expect(onClose).toHaveBeenCalledOnce();
		});
	});

	describe("inert", () => {
		test("falls through to the underlying dialog element", () => {
			const wrapper = mount({ inert: true });

			expect(wrapper.find("dialog").attributes("inert")).not.toBeUndefined();
		});

		test("is absent from the underlying dialog element by default", () => {
			const wrapper = mount();

			expect(wrapper.find("dialog").attributes("inert")).toBeUndefined();
		});
	});

	describe("danger", () => {
		test("styles the confirm button as primary by default", () => {
			const wrapper = mount();

			expect(wrapper.find('[data-test="confirm-dialog-confirm"]').classes()).toContain(
				"button--primary",
			);
		});

		test("styles the confirm button as danger when set", () => {
			const wrapper = mount({ danger: true });

			expect(wrapper.find('[data-test="confirm-dialog-confirm"]').classes()).toContain(
				"button--danger",
			);
		});
	});
});
