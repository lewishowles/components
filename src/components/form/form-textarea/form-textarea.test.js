import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormTextarea from "./form-textarea.vue";

const mount = createMount(FormTextarea);

describe("form-textarea", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
