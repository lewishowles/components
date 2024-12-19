import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconChevronUpCircled from "./icon-chevron-up-circled.vue";

const mount = createMount(IconChevronUpCircled);

describe("icon-chevron-up-circled", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
