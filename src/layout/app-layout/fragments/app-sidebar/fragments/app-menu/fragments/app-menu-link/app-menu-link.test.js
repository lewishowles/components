import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import { useRoute } from "vue-router";
import AppMenuLink from "./app-menu-link.vue";

vi.mock("vue-router");

const mount = createMount(AppMenuLink);

describe("app-menu-link", () => {
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
