import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import IconChevronRightCircled from "./icon-chevron-right-circled.vue";

const mount = createMount(IconChevronRightCircled);

describe("icon-chevron-right-circled", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
