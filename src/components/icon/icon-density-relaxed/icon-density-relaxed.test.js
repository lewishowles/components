import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconDensityRelaxed from "./icon-density-relaxed.vue";

const mount = createMount(IconDensityRelaxed);

describe("icon-density-relaxed", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
