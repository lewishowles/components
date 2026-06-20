import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { nextTick } from "vue";

import FormCheckbox from "./form-checkbox.vue";

const mount = createMount(FormCheckbox);

describe("form-checkbox", () => {
	describe("Initialisation", () => {
		test("A Vue component should exist", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Indeterminate state", () => {
		test("Sets the indeterminate DOM property when prop is true", async () => {
			const wrapper = mount({ props: { indeterminate: true } });

			await nextTick();

			const input = wrapper.find('input[type="checkbox"]').element;

			expect(input.indeterminate).toBe(true);
		});

		test("Unsets the indeterminate DOM property when prop is false", async () => {
			const wrapper = mount({ props: { indeterminate: false } });

			await nextTick();

			const input = wrapper.find('input[type="checkbox"]').element;

			expect(input.indeterminate).toBe(false);
		});
	});

	describe("Props", () => {
		describe("required", () => {
			test("sets the required attribute on the input when required", () => {
				const wrapper = mount({ props: { required: true } });

				expect(wrapper.find("input").attributes("required")).toBeDefined();
			});

			test("does not set the required attribute on the input by default", () => {
				const wrapper = mount();

				expect(wrapper.find("input").attributes("required")).toBeUndefined();
			});
		});
	});
});
