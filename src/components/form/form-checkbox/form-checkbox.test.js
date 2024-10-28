import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormCheckbox from "./form-checkbox.vue";

const mount = createMount(FormCheckbox);

describe("form-checkbox", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
