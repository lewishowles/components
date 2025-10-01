import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import AppMenu from "./app-menu.vue";

const mount = createMount(AppMenu);

describe("app-menu", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
