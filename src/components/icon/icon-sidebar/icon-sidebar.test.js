import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconSidebar from "./icon-sidebar.vue";

const mount = createMount(IconSidebar);

describe("icon-sidebar", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
