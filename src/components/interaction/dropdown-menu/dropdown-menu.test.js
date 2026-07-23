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
	});
});
