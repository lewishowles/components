import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconDensityStandard from "./icon-density-standard.vue";

const mount = createMount(IconDensityStandard);

describe("icon-density-standard", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
