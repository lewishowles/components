import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconHamburger from "./icon-hamburger.vue";

const mount = createMount(IconHamburger);

describe("icon-hamburger", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
