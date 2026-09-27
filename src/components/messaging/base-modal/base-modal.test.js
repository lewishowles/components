import { createMount } from "@lewishowles/testing/vue";
import { flushPromises } from "@vue/test-utils";
import { describe, expect, test, vi } from "vite-plus/test";
import { h } from "vue";
import BaseModal from "./base-modal.vue";

const mount = createMount(BaseModal);

describe("base-modal", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("sets a negative tabindex on the dialog", () => {
			const wrapper = mount();

			expect(wrapper.attributes("tabindex")).toBe("-1");
		});
	});

	describe("Expose", () => {
		test("exposes isOpen as false when initially closed", () => {
			const wrapper = mount({ props: { initiallyOpen: false } });

			expect(wrapper.vm.isOpen).toBe(false);
		});

		test("exposes isOpen as true when initially open", () => {
			const wrapper = mount({ props: { initiallyOpen: true } });

			expect(wrapper.vm.isOpen).toBe(true);
		});

		test("exposes open and close", () => {
			const wrapper = mount();

			expect(wrapper.vm.open).toBeTypeOf("function");
			expect(wrapper.vm.close).toBeTypeOf("function");
		});
	});

	describe("Closing", () => {
		test("emits dialog:close immediately when no exit animation is running", () => {
			const wrapper = mount();

			wrapper.element.getAnimations = vi.fn(() => []);

			wrapper.vm.close();

			expect(wrapper.emitted("dialog:close")).toHaveLength(1);
		});

		test("emits dialog:close once after the exit animations settle", async () => {
			const wrapper = mount();

			let finishAnimation;

			const finished = new Promise((resolve) => {
				finishAnimation = resolve;
			});

			wrapper.element.getAnimations = vi.fn(() => [{ finished }]);

			wrapper.vm.close();

			expect(wrapper.vm.isOpen).toBe(false);
			expect(wrapper.emitted("dialog:close")).toBeUndefined();

			finishAnimation();
			await vi.waitFor(() => {
				expect(wrapper.emitted("dialog:close")).toHaveLength(1);
			});
		});

		test("emits dialog:close without waiting for a looping animation", () => {
			const wrapper = mount();

			const loopingAnimation = {
				effect: { getComputedTiming: () => ({ endTime: Infinity }) },
				finished: new Promise(() => {}),
			};

			wrapper.element.getAnimations = vi.fn(() => [loopingAnimation]);

			wrapper.vm.close();

			expect(wrapper.emitted("dialog:close")).toHaveLength(1);
		});

		test("emits a pending close before reopening, once", async () => {
			const wrapper = mount();

			let finishAnimation;

			const finished = new Promise((resolve) => {
				finishAnimation = resolve;
			});

			wrapper.element.getAnimations = vi.fn(() => [{ finished }]);

			wrapper.vm.close();
			wrapper.vm.open();

			expect(wrapper.emitted("dialog:close")).toHaveLength(1);
			expect(wrapper.vm.isOpen).toBe(true);

			finishAnimation();
			await flushPromises();

			expect(wrapper.emitted("dialog:close")).toHaveLength(1);
		});

		test("emits dialog:close once when closed through the exposed method", async () => {
			const wrapper = mount();

			wrapper.vm.close();
			await wrapper.trigger("close");

			expect(wrapper.emitted("dialog:close")).toHaveLength(1);
			expect(wrapper.vm.isOpen).toBe(false);
		});

		test("emits dialog:close when the native dialog closes", async () => {
			const wrapper = mount();

			await wrapper.trigger("close");

			expect(wrapper.emitted("dialog:close")).toHaveLength(1);
			expect(wrapper.vm.isOpen).toBe(false);
		});

		test("ignores a late programmatic close event after reopening", async () => {
			const wrapper = mount();

			const close = vi.spyOn(wrapper.element, "close").mockImplementation(() => {
				wrapper.element.open = false;
			});

			try {
				wrapper.vm.close();
				wrapper.vm.open();
				await wrapper.trigger("close");

				expect(wrapper.emitted("dialog:close")).toHaveLength(1);
				expect(wrapper.vm.isOpen).toBe(true);

				await wrapper.trigger("close");

				expect(wrapper.emitted("dialog:close")).toHaveLength(2);
				expect(wrapper.vm.isOpen).toBe(false);
			} finally {
				close.mockRestore();
			}
		});
	});

	describe("Focus", () => {
		test("focuses the dialog when no autofocus descendant exists", () => {
			const wrapper = mount({
				props: { initiallyOpen: false },
				attachTo: document.body,
			});

			wrapper.vm.open();

			expect(document.activeElement).toBe(wrapper.element);
		});

		test("does not focus the dialog when an autofocus descendant exists and focusDialogOnOpen is false", () => {
			const wrapper = mount({
				props: { initiallyOpen: false, focusDialogOnOpen: false },
				slots: { default: () => h("input", { autofocus: true }) },
				attachTo: document.body,
			});

			wrapper.vm.open();

			expect(document.activeElement).not.toBe(wrapper.element);
		});

		test("focuses the dialog when focusDialogOnOpen is true despite an autofocus descendant", () => {
			const wrapper = mount({
				props: { initiallyOpen: false, focusDialogOnOpen: true },
				slots: { default: () => h("input", { autofocus: true }) },
				attachTo: document.body,
			});

			wrapper.vm.open();

			expect(document.activeElement).toBe(wrapper.element);
		});
	});
});
