import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormPrefix from "./form-prefix.vue";

const mount = createMount(FormPrefix);

describe("form-prefix", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
