import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconPin from "./icon-pin.vue";

const mount = createMount(IconPin);

describe("icon-pin", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
