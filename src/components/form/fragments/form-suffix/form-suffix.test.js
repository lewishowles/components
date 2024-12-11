import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormSuffix from "./form-suffix.vue";

const mount = createMount(FormSuffix);

describe("form-suffix", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
