import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import BaseIcon from "./base-icon.vue";

describe("base-icon", () => {
	describe("Initialisation", () => {
		it("should exist as a Vue component", () => {
			const wrapper = mount(BaseIcon);

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
