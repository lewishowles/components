import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconChevronLeft from "./icon-chevron-left.vue";

const mount = createMount(IconChevronLeft);

describe("icon-chevron-left", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
