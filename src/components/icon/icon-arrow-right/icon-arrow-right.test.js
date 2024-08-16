import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconArrowRight from "./icon-arrow-right.vue";

const mount = createMount(IconArrowRight);

describe("icon-arrow-right", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
