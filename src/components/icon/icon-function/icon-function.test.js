import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconFunction from "./icon-function.vue";

const mount = createMount(IconFunction);

describe("icon-function", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
