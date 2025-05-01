import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconMegaphone from "./icon-megaphone.vue";

const mount = createMount(IconMegaphone);

describe("icon-megaphone", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
