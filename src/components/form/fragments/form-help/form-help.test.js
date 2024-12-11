import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormHelp from "./form-help.vue";

const mount = createMount(FormHelp);

describe("form-help", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
