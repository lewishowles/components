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

	describe("Computed", () => {
		describe("triggerProps", () => {
			test("Includes aria-haspopup set to menu", () => {
				const wrapper = mount();

				expect(wrapper.vm.triggerProps["aria-haspopup"]).toBe("menu");
			});

			test("Reflects the closed state in aria-expanded", () => {
				const wrapper = mount();

				expect(wrapper.vm.triggerProps["aria-expanded"]).toBe(false);
			});

			test("Reflects the open state in aria-expanded", async () => {
				const wrapper = mount();

				await wrapper.vm.openMenu();

				expect(wrapper.vm.triggerProps["aria-expanded"]).toBe(true);
			});

			test("Includes aria-controls referencing the menu panel", () => {
				const wrapper = mount();

				expect(wrapper.vm.triggerProps["aria-controls"]).toBeTypeOf("string");
				expect(wrapper.vm.triggerProps["aria-controls"].length).toBeGreaterThan(0);
			});
		});
	});
});
