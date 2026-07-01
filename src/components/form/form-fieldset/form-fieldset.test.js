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

	describe("compact", () => {
		const compactProvide = { "form-wrapper": { isCompact: { value: true } } };

		test("reduces heading size when compact is provided", () => {
			const wrapper = mount({
				slots: { title: "Section title" },
				global: { provide: compactProvide },
			});

			const heading = wrapper.find("h2");

			expect(heading.classes()).toContain("text-xl");
			expect(heading.classes()).not.toContain("text-3xl");
		});

		test("titleClasses override wins over compact heading size", () => {
			const wrapper = mount({
				props: { titleClasses: "text-4xl" },
				slots: { title: "Section title" },
				global: { provide: compactProvide },
			});

			const heading = wrapper.find("h2");

			expect(heading.classes()).toContain("text-4xl");
			expect(heading.classes()).not.toContain("text-xl");
		});

		test("reduces header block spacing when compact is provided", () => {
			const wrapper = mount({
				slots: { title: "Section title" },
				global: { provide: compactProvide },
			});

			const header = wrapper.find(".border-b");

			expect(header.classes()).toContain("mb-4");
			expect(header.classes()).toContain("pb-4");
			expect(header.classes()).not.toContain("mb-6");
			expect(header.classes()).not.toContain("pb-6");
		});

		test("uses default spacing when compact is not provided", () => {
			const wrapper = mount({ slots: { title: "Section title" } });

			const header = wrapper.find(".border-b");

			expect(header.classes()).toContain("mb-6");
			expect(header.classes()).toContain("pb-6");
		});
	});
});
