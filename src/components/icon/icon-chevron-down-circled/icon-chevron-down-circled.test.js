import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconChevronDownCircled from "./icon-chevron-down-circled.vue";

const mount = createMount(IconChevronDownCircled);

describe("icon-chevron-down-circled", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
