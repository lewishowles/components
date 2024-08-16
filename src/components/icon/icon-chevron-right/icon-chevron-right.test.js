import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconChevronRight from "./icon-chevron-right.vue";

const mount = createMount(IconChevronRight);

describe("icon-chevron-right", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
