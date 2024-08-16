import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconChevronUp from "./icon-chevron-up.vue";

const mount = createMount(IconChevronUp);

describe("icon-chevron-up", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
