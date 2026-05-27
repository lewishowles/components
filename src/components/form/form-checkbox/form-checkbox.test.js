import { createMount } from "@unit/support/mount";
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
});
