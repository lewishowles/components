import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import IconChevronLeft from "./icon-chevron-left.vue";

describe("icon-chevron-left", () => {
	describe("Initialisation", () => {
		it("should exist as a Vue component", () => {
			const wrapper = mount(IconChevronLeft);

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
