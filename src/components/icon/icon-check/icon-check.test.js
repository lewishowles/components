import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconCheck from "./icon-check.vue";

const mount = createMount(IconCheck);

describe("icon-check", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
