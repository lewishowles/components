import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconLightbulb from "./icon-lightbulb.vue";

const mount = createMount(IconLightbulb);

describe("icon-lightbulb", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
