import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconCross from "./icon-cross.vue";

const mount = createMount(IconCross);

describe("icon-cross", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
