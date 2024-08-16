import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormActions from "./form-actions.vue";

const mount = createMount(FormActions);

describe("form-actions", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
