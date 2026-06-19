import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import BaseModal from "./base-modal.vue";

const mount = createMount(BaseModal);

describe("base-modal", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
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
});
