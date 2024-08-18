import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconMoon from "./icon-moon.vue";

const mount = createMount(IconMoon);

describe("icon-moon", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
