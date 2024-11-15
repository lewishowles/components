import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DropdownMenuButton from "./dropdown-menu-button.vue";

const mount = createMount(DropdownMenuButton);

describe("dropdown-menu-button", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
