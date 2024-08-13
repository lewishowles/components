import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconExternal from "./icon-external.vue";

const mount = createMount(IconExternal);

describe("icon-external", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
