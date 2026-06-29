import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import FormFieldset from "./form-fieldset.vue";

const mount = createMount(FormFieldset);
// Deep mount renders child components fully, needed for layoutClasses tests
// that assert against the inner form-layout's real DOM.
const mountDeep = createDeepMount(FormFieldset);

describe("form-fieldset", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("titleClasses", () => {
		test("applies default title classes when no titleClasses provided", () => {
			const wrapper = mount({ slots: { title: "Section title" } });

			const heading = wrapper.find("h2");

			expect(heading.classes()).toContain("text-3xl");
			expect(heading.classes()).toContain("font-bold");
		});

		test("merges user-provided titleClasses with defaults", () => {
			const wrapper = mount({
				props: { titleClasses: "text-4xl text-blue-500" },
				slots: { title: "Section title" },
			});

			const heading = wrapper.find("h2");

			expect(heading.classes()).toContain("text-4xl");
			expect(heading.classes()).toContain("text-blue-500");
			expect(heading.classes()).not.toContain("text-3xl");
		});
	});

	describe("layoutClasses", () => {
		test("passes layoutClasses through to the inner form-layout", () => {
			const wrapper = mountDeep({
				props: { layoutClasses: "gap-y-4" },
				slots: { default: "Content" },
			});

			const layout = wrapper.find('[data-test="form-layout"]');

			expect(layout.classes()).toContain("gap-y-4");
			expect(layout.classes()).not.toContain("gap-y-8");
		});
	});
});
