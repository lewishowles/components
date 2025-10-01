import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import AppMenuLink from "./app-menu-link.vue";

const mount = createMount(AppMenuLink);

describe("app-menu-link", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
