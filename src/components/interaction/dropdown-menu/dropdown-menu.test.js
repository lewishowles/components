import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DropdownMenu from "./dropdown-menu.vue";

const mount = createMount(DropdownMenu);

describe("dropdown-menu", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
