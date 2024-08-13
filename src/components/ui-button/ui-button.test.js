import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import UiButton from "./ui-button.vue";

const mount = createMount(UiButton);

describe("ui-button", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
