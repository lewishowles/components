import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import UiButton from "./ui-button.vue";

describe("ui-button", () => {
	describe("Initialisation", () => {
		it("should exist as a Vue component", () => {
			const wrapper = mount(UiButton);

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
