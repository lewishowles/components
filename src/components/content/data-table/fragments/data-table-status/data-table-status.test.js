import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import DataTableStatus, { statusTypes } from "./data-table-status.vue";

const mount = createMount(DataTableStatus);

describe("data-table-status", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("should export the status type tokens", () => {
			expect(statusTypes).toEqual({ SORT: "sort", SEARCH: "search", SELECTION: "selection" });
		});
	});

	describe("Rendering", () => {
		test("should announce nothing when no type is active", () => {
			const wrapper = mount();

			expect(wrapper.text().trim()).toBe("");
		});

		test("should announce an ascending sort", () => {
			const wrapper = mount({ type: statusTypes.SORT, sortColumn: "Title", ascending: true });

			expect(wrapper.text()).toContain("Sorted by Title ascending");
		});

		test("should announce a descending sort", () => {
			const wrapper = mount({ type: statusTypes.SORT, sortColumn: "Title", ascending: false });

			expect(wrapper.text()).toContain("Sorted by Title descending");
		});

		test("should announce multiple search results", () => {
			const wrapper = mount({ type: statusTypes.SEARCH, resultCount: 3, query: "ald" });

			expect(wrapper.text()).toContain('Showing 3 results for "ald"');
		});

		test("should announce a single search result", () => {
			const wrapper = mount({ type: statusTypes.SEARCH, resultCount: 1, query: "ald" });

			expect(wrapper.text()).toContain('Showing 1 result for "ald"');
		});

		test("should announce no search results", () => {
			const wrapper = mount({ type: statusTypes.SEARCH, resultCount: 0, query: "zzz" });

			expect(wrapper.text()).toContain('No results for "zzz"');
		});

		test("should announce a partial selection", () => {
			const wrapper = mount({ type: statusTypes.SELECTION, selectedCount: 2, totalCount: 5 });

			expect(wrapper.text()).toContain("2 of 5 rows selected");
		});

		test("should announce a full selection", () => {
			const wrapper = mount({
				type: statusTypes.SELECTION,
				selectedCount: 5,
				totalCount: 5,
				allSelected: true,
			});

			expect(wrapper.text()).toContain("All 5 rows selected");
		});

		test("should announce an empty selection", () => {
			const wrapper = mount({ type: statusTypes.SELECTION, selectedCount: 0, totalCount: 5 });

			expect(wrapper.text()).toContain("All rows deselected");
		});
	});
});
