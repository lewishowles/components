import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import DataTableStatus from "./data-table-status.vue";

const mount = createMount(DataTableStatus);

describe("data-table-status", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Announcements", () => {
		test("announces nothing before a value changes", () => {
			const wrapper = mount();

			expect(wrapper.text().trim()).toBe("");
		});

		test("does not announce an initial controlled sort", () => {
			const wrapper = mount({ sortColumn: "Title", ascending: false });

			expect(wrapper.text()).toBe("");
		});

		test("announces an ascending sort", async () => {
			const wrapper = mount();

			await wrapper.setProps({ sortColumn: "Title", ascending: true });

			expect(wrapper.text()).toContain("Sorted by Title ascending");
		});

		test("allows the sort announcement to be customised", async () => {
			const wrapper = mount({
				slots: { "sort-status": "Custom sort message" },
			});

			await wrapper.setProps({ sortColumn: "Title", ascending: true });

			expect(wrapper.text()).toContain("Custom sort message");
		});

		test("announces a descending sort", async () => {
			const wrapper = mount({ sortColumn: "Title", ascending: true });

			await wrapper.setProps({ ascending: false });

			expect(wrapper.text()).toContain("Sorted by Title descending");
		});

		test("clears a sort announcement when sorting is turned off", async () => {
			const wrapper = mount();

			await wrapper.setProps({ sortColumn: "Title", ascending: true });

			expect(wrapper.text()).toContain("Sorted by Title ascending");

			await wrapper.setProps({ enableSort: false });

			expect(wrapper.text()).toBe("");
		});

		test("announces multiple search results", async () => {
			const wrapper = mount();

			await wrapper.setProps({ resultCount: 3, query: "ald" });

			expect(wrapper.text()).toContain('Showing 3 results for "ald"');
		});

		test("announces a single search result", async () => {
			const wrapper = mount();

			await wrapper.setProps({ resultCount: 1, query: "ald" });

			expect(wrapper.text()).toContain('Showing 1 result for "ald"');
		});

		test("announces no search results", async () => {
			const wrapper = mount();

			await wrapper.setProps({ query: "zzz" });

			expect(wrapper.text()).toContain('No results for "zzz"');
		});

		test("does not announce an empty search query", async () => {
			const wrapper = mount({ query: "ald", resultCount: 3 });

			await wrapper.setProps({ query: "" });

			expect(wrapper.text()).toBe("");
		});

		test("announces a partial selection", async () => {
			const wrapper = mount({ enableSelection: true, totalCount: 5 });

			await wrapper.setProps({ selectedCount: 2 });

			expect(wrapper.text()).toContain("2 of 5 rows selected");
		});

		test("announces a full selection", async () => {
			const wrapper = mount({
				enableSelection: true,
				totalCount: 5,
				allSelected: true,
			});

			await wrapper.setProps({ selectedCount: 5 });

			expect(wrapper.text()).toContain("All 5 rows selected");
		});

		test("announces an empty selection", async () => {
			const wrapper = mount({ enableSelection: true, selectedCount: 2, totalCount: 5 });

			await wrapper.setProps({ selectedCount: 0 });

			expect(wrapper.text()).toContain("All rows deselected");
		});

		test("does not announce selection changes while selection is off", async () => {
			const wrapper = mount({ totalCount: 5 });

			await wrapper.setProps({ selectedCount: 2 });

			expect(wrapper.text()).toBe("");
		});

		test("switches to the latest changed announcement", async () => {
			const wrapper = mount({ enableSelection: true, totalCount: 5 });

			await wrapper.setProps({ sortColumn: "Title", ascending: true });
			await wrapper.setProps({ query: "ald", resultCount: 3 });

			expect(wrapper.text()).toContain('Showing 3 results for "ald"');

			await wrapper.setProps({ selectedCount: 2 });

			expect(wrapper.text()).toContain("2 of 5 rows selected");

			await wrapper.setProps({ ascending: false });

			expect(wrapper.text()).toContain("Sorted by Title descending");
		});
	});
});
