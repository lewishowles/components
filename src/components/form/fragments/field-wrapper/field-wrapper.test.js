import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FieldWrapper from "./field-wrapper.vue";

const mount = createMount(FieldWrapper);

describe("field-wrapper", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
