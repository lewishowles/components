import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconArrowDown from "./icon-arrow-down.vue";

const mount = createMount(IconArrowDown);

describe("icon-arrow-down", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
