import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconPlus from "./icon-plus.vue";

const mount = createMount(IconPlus);

describe("icon-plus", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
