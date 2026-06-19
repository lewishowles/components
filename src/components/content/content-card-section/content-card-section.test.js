import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";

import ContentCardSection from "./content-card-section.vue";

const mount = createMount(ContentCardSection, { slots: { default: "Section content" } });

describe("content-card-section", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		test("Uses vertical stacking classes by default", () => {
			const wrapper = mount();

			expect(wrapper.vm.sectionClasses).toContain("border");
			expect(wrapper.vm.sectionClasses).toContain("first:rounded-t-xl");
			expect(wrapper.vm.sectionClasses).not.toContain("flex-1");
		});

		test("Uses column classes when inside content-card-columns", () => {
			const wrapper = mount({ global: { provide: { "content-card-columns": true } } });

			expect(wrapper.vm.sectionClasses).toContain("flex-1");
			expect(wrapper.vm.sectionClasses).not.toContain("first:rounded-t-xl");
		});
	});
});
