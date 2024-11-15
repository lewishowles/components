import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DropdownMenuDivider from "./dropdown-menu-divider.vue";

const mount = createMount(DropdownMenuDivider);

describe("dropdown-menu-divider", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
