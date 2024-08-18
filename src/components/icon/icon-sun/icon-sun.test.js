import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconSun from "./icon-sun.vue";

const mount = createMount(IconSun);

describe("icon-sun", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
