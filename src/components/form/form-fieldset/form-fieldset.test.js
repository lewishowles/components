import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormFieldset from "./form-fieldset.vue";

const mount = createMount(FormFieldset);

describe("form-fieldset", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
