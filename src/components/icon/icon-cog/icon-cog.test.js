import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconCog from "./icon-cog.vue";

const mount = createMount(IconCog);

describe("icon-cog", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
