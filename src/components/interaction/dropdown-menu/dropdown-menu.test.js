import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { h, nextTick, ref } from "vue";
import { beforeEach, describe, expect, test, vi } from "vite-plus/test";

const isNarrow = ref(false);

vi.mock("@vueuse/core", async (importOriginal) => ({
	...(await importOriginal()),
	useMediaQuery: () => globalThis.__dropdownMenuIsNarrow,
}));

import DropdownMenu from "./dropdown-menu.vue";

const mount = createMount(DropdownMenu);
const mountDeep = createDeepMount(DropdownMenu);

globalThis.__dropdownMenuIsNarrow = isNarrow;

describe("dropdown-menu", () => {
	beforeEach(() => {
		isNarrow.value = false;
	});

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

			test("Uses dialog semantics for the narrow sheet", async () => {
				const wrapper = mount();

				isNarrow.value = true;
				await nextTick();

				expect(wrapper.vm.triggerProps["aria-haspopup"]).toBe("dialog");
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

	describe("Responsive presentation", () => {
		test("clears desktop roving tabindex when an open menu becomes narrow", async () => {
			const wrapper = mountDeep({
				slots: {
					default: () => [
						h("button", { "data-test": "first-item" }, "First"),
						h("button", { "data-test": "second-item" }, "Second"),
					],
					summary: "Actions",
				},
			});

			await wrapper.vm.openMenu();

			const firstItem = wrapper.find('[data-test="first-item"]');
			const secondItem = wrapper.find('[data-test="second-item"]');

			expect(firstItem.attributes("tabindex")).toBe("0");
			expect(secondItem.attributes("tabindex")).toBe("-1");

			isNarrow.value = true;
			await nextTick();

			expect(firstItem.attributes("tabindex")).toBeUndefined();
			expect(secondItem.attributes("tabindex")).toBeUndefined();
		});

		test("clears desktop roving tabindex before a closed menu reopens as a sheet", async () => {
			const wrapper = mountDeep({
				slots: {
					default: () => [
						h("button", { "data-test": "first-item" }, "First"),
						h("button", { "data-test": "second-item" }, "Second"),
					],
					summary: "Actions",
				},
			});

			const firstItem = wrapper.find('[data-test="first-item"]');
			const secondItem = wrapper.find('[data-test="second-item"]');

			await wrapper.vm.openMenu();

			expect(secondItem.attributes("tabindex")).toBe("-1");

			wrapper.vm.closeMenu();
			await nextTick();
			isNarrow.value = true;
			await nextTick();
			await wrapper.vm.openMenu();

			expect(firstItem.attributes("tabindex")).toBeUndefined();
			expect(secondItem.attributes("tabindex")).toBeUndefined();
		});
	});

	describe("Panel state", () => {
		test("Keeps the closed panel mounted and inert", () => {
			const wrapper = mountDeep();
			const panel = wrapper.find('[data-test="dropdown-menu-panel"]');

			expect(panel.exists()).toBe(true);
			expect(panel.attributes("data-state")).toBe("closed");
			expect(panel.attributes("inert")).toBeDefined();
		});

		test("Removes inert while open and restores it on close", async () => {
			const wrapper = mountDeep();
			const panel = wrapper.find('[data-test="dropdown-menu-panel"]');

			await wrapper.vm.openMenu();

			expect(panel.attributes("data-state")).toBe("open");
			expect(panel.attributes("inert")).toBeUndefined();

			wrapper.vm.closeMenu();
			await nextTick();

			expect(panel.attributes("data-state")).toBe("closed");
			expect(panel.attributes("inert")).toBeDefined();
		});

		test("Hides the narrow sheet panel immediately when closed", async () => {
			isNarrow.value = true;
			const wrapper = mountDeep();
			const panel = wrapper.find('[data-test="dropdown-menu-panel"]');

			expect(panel.attributes("hidden")).toBeDefined();

			await wrapper.vm.openMenu();

			expect(panel.attributes("hidden")).toBeUndefined();

			wrapper.vm.closeMenu();
			await nextTick();

			expect(panel.attributes("hidden")).toBeDefined();
		});
	});
});
