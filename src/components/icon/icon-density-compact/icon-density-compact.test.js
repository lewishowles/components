import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconDensityCompact from "./icon-density-compact.vue";

const mount = createMount(IconDensityCompact);

describe("icon-density-compact", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
