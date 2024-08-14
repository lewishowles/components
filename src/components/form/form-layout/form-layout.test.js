import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormLayout from "./form-layout.vue";

const mount = createMount(FormLayout);

describe("form-layout", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
