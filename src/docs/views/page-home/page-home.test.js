import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import useMenu from "@/docs/composables/use-menu/use-menu";

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

				menu.registerMenuItem({ section: "Form", label: "form-wrapper", to: "/form/form-wrapper" });
				menu.registerMenuItem({ section: "Form", label: "form-field", to: "/form/form-field" });

				expect(vm.internalSections).toEqual({
					Form: {
						label: "Form",
						icon: expect.any(Object),
						colours: expect.any(String),
						items: [
							{ section: "Form", label: "form-field", to: "/form/form-field" },
							{ section: "Form", label: "form-wrapper", to: "/form/form-wrapper" },
						],
					},
				});
			});

			test("should configure form fields with the form icon", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const menu = useMenu();

				menu.registerMenuItem({
					section: "Form fields",
					label: "form-input",
					to: "/form/form-input",
				});

				expect(vm.internalSections["Form fields"]).toEqual({
					label: "Form fields",
					icon: expect.any(Object),
					colours: expect.stringContaining("orange"),
					items: [{ section: "Form fields", label: "form-input", to: "/form/form-input" }],
				});
			});
		});
	});
});
