import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import useMenu from "@/composables/use-menu/use-menu";

import PageHome from "./page-home.vue";

const mount = createMount(PageHome);

describe("page-home", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalSections", () => {
			test("should combine section configuration with menu items", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const menu = useMenu();

				menu.registerMenuItem({ section: "Form", label: "form-field", to: "/form/form-field" });

				expect(vm.internalSections).toEqual({
					Form: {
						label: "Form",
						icon: expect.any(Object),
						colours: expect.any(String),
						items: [{ section: "Form", label: "form-field", to: "/form/form-field" }],
					},
				});
			});
		});
	});
});
