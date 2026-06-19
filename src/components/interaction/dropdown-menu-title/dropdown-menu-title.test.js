import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import DropdownMenuTitle from "./dropdown-menu-title.vue";

const mount = createMount(DropdownMenuTitle);

describe("dropdown-menu-title", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
