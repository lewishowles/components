import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import { useRoute } from "vue-router";
import AppMenu from "./app-menu.vue";

vi.mock("vue-router");

const mount = createMount(AppMenu);

describe("app-menu", () => {
	useRoute.mockReturnValue({
		path: "",
	});

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
