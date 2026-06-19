import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
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
