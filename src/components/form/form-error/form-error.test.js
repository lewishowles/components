import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormError from "./form-error.vue";

const mount = createMount(FormError);

describe("form-error", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
