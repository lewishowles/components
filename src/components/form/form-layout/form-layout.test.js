import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import FormLayout from "./form-layout.vue";

const mount = createMount(FormLayout);

describe("form-layout", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("rootClass", () => {
			test("includes base layout classes by default", () => {
				const wrapper = mount();

				expect(wrapper.vm.rootClass).toContain("flex flex-col gap-y-8");
			});

			test("merges override classes, resolving Tailwind conflicts", () => {
				const wrapper = mount({ attrs: { class: "gap-y-4" } });

				expect(wrapper.vm.rootClass).toContain("gap-y-4");
				expect(wrapper.vm.rootClass).not.toContain("gap-y-8");
			});
		});
	});
});
