import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DropdownMenuCheckbox from "./dropdown-menu-checkbox.vue";

const mount = createMount(DropdownMenuCheckbox);

describe("dropdown-menu-checkbox", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
