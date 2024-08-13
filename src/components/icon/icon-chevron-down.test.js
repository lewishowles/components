import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import IconChevronDown from "./icon-chevron-down.vue";

describe("icon-chevron-down", () => {
	describe("Initialisation", () => {
		it("should exist as a Vue component", () => {
			const wrapper = mount(IconChevronDown);

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
