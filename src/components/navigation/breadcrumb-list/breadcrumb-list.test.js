import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";
import { nextTick } from "vue";
import BreadcrumbList from "./breadcrumb-list.vue";

const mount = createMount(BreadcrumbList);

describe("breadcrumb-list", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");

			wrapper.unmount();
		});
	});

	describe("Scroll indicators", () => {
		test("sets the initial scroll position to the end of an overflowing list", async () => {
			const wrapper = mount();
			const listWrapper = wrapper.get('[data-part="list"]');
			const list = listWrapper.element;
			const nav = wrapper.get('[data-part="nav"]');

			Object.defineProperties(list, {
				clientWidth: { configurable: true, value: 100 },
				scrollWidth: { configurable: true, value: 400 },
				scrollTo: {
					configurable: true,
					value: ({ left }) => {
						list.scrollLeft = Math.min(left, list.scrollWidth - list.clientWidth);
					},
				},
			});

			await nextTick();
			// The initial measure updates arrivedState asynchronously, so the indicator class binding needs a second tick.
			await nextTick();

			expect(list.scrollLeft).toBe(300);
			expect(nav.classes()).toContain("show-left");
			expect(nav.classes()).not.toContain("show-right");
			expect(listWrapper.classes()).toContain("overflow-x-auto");
			expect(listWrapper.classes()).not.toContain("show-left");
			expect(listWrapper.classes()).not.toContain("show-right");

			wrapper.unmount();
		});

		test("positions an initially hidden list after it becomes visible", async () => {
			let resizeObserverCallback;

			vi.stubGlobal(
				"ResizeObserver",
				class {
					constructor(callback) {
						resizeObserverCallback = callback;
					}

					observe() {}
					disconnect() {}
				},
			);

			try {
				const wrapper = mount();
				const list = wrapper.get('[data-part="list"]').element;

				let clientWidth = 0;
				let scrollWidth = 0;

				Object.defineProperties(list, {
					clientWidth: { configurable: true, get: () => clientWidth },
					scrollWidth: { configurable: true, get: () => scrollWidth },
					scrollTo: {
						configurable: true,
						value: ({ left }) => {
							list.scrollLeft = Math.min(left, scrollWidth - clientWidth);
						},
					},
				});

				await nextTick();
				await nextTick();

				expect(list.scrollLeft).toBe(0);
				expect(resizeObserverCallback).toBeTypeOf("function");

				clientWidth = 100;
				scrollWidth = 400;
				resizeObserverCallback([{ target: list }]);

				await nextTick();
				await nextTick();

				expect(list.scrollLeft).toBe(300);

				wrapper.unmount();
			} finally {
				vi.unstubAllGlobals();
			}
		});
	});
});
