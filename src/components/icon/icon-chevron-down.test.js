import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconChevronDown from "./icon-chevron-down.vue";

const mount = createMount(IconChevronDown);

describe("icon-chevron-down", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
