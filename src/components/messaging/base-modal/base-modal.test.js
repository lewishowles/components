import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
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
