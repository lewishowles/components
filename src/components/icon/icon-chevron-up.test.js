import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import IconChevronUp from "./icon-chevron-up.vue";

describe("icon-chevron-up", () => {
	describe("Initialisation", () => {
		it("should exist as a Vue component", () => {
			const wrapper = mount(IconChevronUp);

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
