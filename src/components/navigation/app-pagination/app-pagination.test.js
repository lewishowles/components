import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";
import AppPagination from "./app-pagination.vue";

const defaultProps = { count: 100 };
const mount = createMount(AppPagination, { props: defaultProps });

describe("app-pagination", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("computed", () => {
		describe("pageCount", () => {
			test("should reject an invalid `count`", () => {
				const wrapper = mount({ count: "seven" });
				const vm = wrapper.vm;

				expect(vm.pageCount).toBe(1);
			});

			test("should reject an invalid `itemsPerPage`", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.itemsPerPage = "12";

				expect(vm.pageCount).toBe(1);
			});

			test("should calculate the required number of pages", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.pageCount).toBe(10);

				vm.itemsPerPage = 12;

				expect(vm.pageCount).toBe(9);

				vm.itemsPerPage = 26;

				expect(vm.pageCount).toBe(4);
			});
		});

		describe("haveSinglePage", () => {
			test("should detect a single page", () => {
				const wrapper = mount({ count: 5 });
				const vm = wrapper.vm;

				expect(vm.haveSinglePage).toBe(true);
			});

			test("should detect multiple pages", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.haveSinglePage).toBe(false);
			});
		});

		describe("displayBeforeSummary", () => {
			test("should recognise when a summary is needed", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				[
					[1, false],
					[2, false],
					[3, false],
					[4, true],
					[5, true],
					[6, true],
					[7, true],
					[8, true],
					[9, true],
					[10, true],
				].forEach(([page, result]) => {
					vm.currentPage = page;

					expect(vm.displayBeforeSummary).toBe(result);
				});
			});

			test("should not show a summary when there are too few pages", () => {
				const wrapper = mount({ count: 40 });
				const vm = wrapper.vm;

				[
					[1, false],
					[2, false],
					[3, false],
					[4, false],
				].forEach(([page, result]) => {
					vm.currentPage = page;

					expect(vm.displayBeforeSummary).toBe(result);
				});
			});
		});

		describe("displayAfterSummary", () => {
			test("should recognise when a summary is needed", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				[
					[1, true],
					[2, true],
					[3, true],
					[4, true],
					[5, true],
					[6, true],
					[7, true],
					[8, false],
					[9, false],
					[10, false],
				].forEach(([page, result]) => {
					vm.currentPage = page;

					expect(vm.displayAfterSummary).toBe(result);
				});
			});

			test("should not show a summary when there are too few pages", () => {
				const wrapper = mount({ count: 40 });
				const vm = wrapper.vm;

				[
					[1, false],
					[2, false],
					[3, false],
					[4, false],
				].forEach(([page, result]) => {
					vm.currentPage = page;

					expect(vm.displayAfterSummary).toBe(result);
				});
			});
		});

		describe("showingFirstPage", () => {
			test("should recognise when previous page is needed", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				[
					[1, true],
					[2, false],
					[3, false],
					[4, false],
					[5, false],
					[6, false],
					[7, false],
					[8, false],
					[9, false],
					[10, false],
				].forEach(([page, result]) => {
					vm.currentPage = page;

					expect(vm.showingFirstPage).toBe(result);
				});
			});
		});

		describe("showingLastPage", () => {
			test("should recognise when previous page is needed", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				[
					[1, false],
					[2, false],
					[3, false],
					[4, false],
					[5, false],
					[6, false],
					[7, false],
					[8, false],
					[9, false],
					[10, true],
				].forEach(([page, result]) => {
					vm.currentPage = page;

					expect(vm.showingLastPage).toBe(result);
				});
			});
		});

		describe("pagesToDisplay", () => {
			test("should show pages 1, 2, 3 and 10 when viewing the first page", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				expect(vm.pagesToDisplay).toEqual([1, 2, 3, 10]);
			});

			test("should show pages 1, 8, 9, 10 when viewing the last page", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				vm.currentPage = 10;

				expect(vm.pagesToDisplay).toEqual([1, 8, 9, 10]);
			});

			test("should show pages 1, 2, 3, 4 when viewing the first page with only 4 pages", () => {
				const wrapper = mount({ count: 40 });
				const vm = wrapper.vm;

				expect(vm.pagesToDisplay).toEqual([1, 2, 3, 4]);
			});

			test("should show pages 1, 2, 3, 4 when viewing the last page with only 4 pages", () => {
				const wrapper = mount({ count: 40 });
				const vm = wrapper.vm;

				vm.currentPage = 4;

				expect(vm.pagesToDisplay).toEqual([1, 2, 3, 4]);
			});

			test("should show pages 1, 2, 3 when viewing the first page with only 3 pages", () => {
				const wrapper = mount({ count: 30 });
				const vm = wrapper.vm;

				expect(vm.pagesToDisplay).toEqual([1, 2, 3]);
			});

			test("should show pages 1, 2, 3 when viewing the last page with only 3 pages", () => {
				const wrapper = mount({ count: 30 });
				const vm = wrapper.vm;

				vm.currentPage = 3;

				expect(vm.pagesToDisplay).toEqual([1, 2, 3]);
			});

			test("should show pages 1, 2, 3 and 10 when viewing the second page", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				vm.currentPage = 2;

				expect(vm.pagesToDisplay).toEqual([1, 2, 3, 10]);
			});

			test("should show pages 1, 2, 3, 4 and 10 when viewing the third page", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				vm.currentPage = 3;

				expect(vm.pagesToDisplay).toEqual([1, 2, 3, 4, 10]);
			});

			test("should show pages 1, 3, 4, 5 and 10 when viewing the fourth page", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				vm.currentPage = 4;

				expect(vm.pagesToDisplay).toEqual([1, 3, 4, 5, 10]);
			});

			test("should show pages 1, 8, 9, 10 when viewing the ninth page", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				vm.currentPage = 9;

				expect(vm.pagesToDisplay).toEqual([1, 8, 9, 10]);
			});

			test("should show pages 1, 7, 8, 9 and 10 when viewing the eighth page", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				vm.currentPage = 8;

				expect(vm.pagesToDisplay).toEqual([1, 7, 8, 9, 10]);
			});

			test("should show pages 1, 6, 7, 8 and 10 when viewing the seventh page", () => {
				const wrapper = mount({ count: 100 });
				const vm = wrapper.vm;

				vm.currentPage = 7;

				expect(vm.pagesToDisplay).toEqual([1, 6, 7, 8, 10]);
			});
		});
	});

	describe("methods", () => {
		describe("selectPreviousPage", () => {
			test("should select the previous page", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.currentPage = 5;

				vm.selectPreviousPage();

				expect(vm.currentPage).toBe(4);

				vm.selectPreviousPage();

				expect(vm.currentPage).toBe(3);
			});

			test("should not be able to select a page lower than 1", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.currentPage = 2;

				vm.selectPreviousPage();

				expect(vm.currentPage).toBe(1);

				vm.selectPreviousPage();

				expect(vm.currentPage).toBe(1);
			});
		});

		describe("selectNextPage", () => {
			test("should select the nxt page", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.currentPage = 5;

				vm.selectNextPage();

				expect(vm.currentPage).toBe(6);

				vm.selectNextPage();

				expect(vm.currentPage).toBe(7);
			});

			test("should not be able to select a page higher than the page count", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.currentPage = 9;

				vm.selectNextPage();

				expect(vm.currentPage).toBe(10);

				vm.selectNextPage();

				expect(vm.currentPage).toBe(10);
			});
		});
	});

	describe("watch", () => {
		test("should emit the current page on change", async() => {
			const wrapper = mount();
			const vm = wrapper.vm;

			expect(wrapper.emitted("@update:page")[0][0]).toBe(1);

			vm.currentPage = 5;

			await nextTick();

			expect(wrapper.emitted("@update:page")[1][0]).toBe(5);
		});

		test("should reset the current page when the number of pages changes", async() => {
			const wrapper = mount();
			const vm = wrapper.vm;

			vm.currentPage = 10;

			await wrapper.setProps({ count: 50 });

			expect(vm.currentPage).toBe(1);
		});
	});
});
