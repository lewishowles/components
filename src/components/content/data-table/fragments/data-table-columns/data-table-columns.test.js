import { createMount } from "@unit/support/mount";
import { afterEach, describe, expect, test } from "vitest";
import { ref } from "vue";
import DataTableColumns from "./data-table-columns.vue";

const tableName = ref("sample-table");
const haveTableName = ref(true);

const columnDefinitions = ref({
	title: {
		label: "Title",
		first: true,
		last: false,
		sortable: true,
	},
	release_year: {
		label: "Release year",
		first: false,
		last: true,
		sortable: true,
	},
});

const global = { provide: { "data-table": { tableName, haveTableName, columnDefinitions } } };
const mount = createMount(DataTableColumns, { global });

describe("data-table-columns", () => {
	afterEach(() => {
		// We remove any local storage for this table after each run to ensure
		// there are no conflicts between tests.
		localStorage.removeItem("data-table:sample-table:columns");
	});

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("should initialise column visibility", () => {
			const wrapper = mount();
			const vm = wrapper.vm;

			expect(vm.columnVisibility).toEqual({
				title: true,
				release_year: true,
			});
		});

		test("should repsect localStorage when initialising column visibility", () => {
			localStorage.setItem("data-table:sample-table:columns", JSON.stringify({ title: false }));

			const wrapper = mount();
			const vm = wrapper.vm;

			expect(vm.columnVisibility).toEqual({
				title: false,
				release_year: true,
			});
		});
	});

	describe("Computed", () => {
		describe("columns", () => {
			test("should extract column list", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.columns).toEqual([
					{
						key: "title",
						label: "Title",
					},
					{
						key: "release_year",
						label: "Release year",
					},
				]);
			});
		});
	});
});
