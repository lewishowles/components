import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import IconChevronRight from "./icon-chevron-right.vue";

describe("icon-chevron-right", () => {
	describe("Initialisation", () => {
		it("should exist as a Vue component", () => {
			const wrapper = mount(IconChevronRight);

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
