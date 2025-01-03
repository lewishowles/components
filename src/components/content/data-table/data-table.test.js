import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DataTable from "./data-table.vue";

const sampleRow = { id: "123", title: "Toy Story", release_year: "1995" };
const defaultProps = { data: [sampleRow] };
const mount = createMount(DataTable, { props: defaultProps });

describe("data-table", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalData", () => {
			test("should handle there being no data present", () => {
				const wrapper = mount({ data: [] });
				const vm = wrapper.vm;

				expect(vm.internalData).toEqual([]);
			});

			describe("should remove any non-empty objects from the data", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, row]) => {
					const wrapper = mount({ data: [sampleRow, row] });
					const vm = wrapper.vm;

					expect(vm.internalData).toEqual([
						{
							configuration: {
								id: expect.any(String),
							},
							content: sampleRow,
						},
					]);
				});
			});
		});

		describe("haveData", () => {
			test("should detect when no data is present", () => {
				const wrapper = mount({ data: [] });
				const vm = wrapper.vm;

				expect(vm.haveData).toBe(false);
			});

			test("should detect when data is present", () => {
				const wrapper = mount({ data: [sampleRow] });
				const vm = wrapper.vm;

				expect(vm.haveData).toBe(true);
			});
		});

		describe("filteredRows", () => {
			test("should contain all rows by default", () => {
				const secondRow = { id: "234", title: "Big Hero 6", release_year: "2014" };
				const wrapper = mount({ data: [sampleRow, secondRow] });
				const vm = wrapper.vm;

				expect(vm.filteredRows).toHaveLength(2);
				expectToHaveRowWith(vm, "title", "Toy Story");
			});

			test("should display a row matching the current search term, case insensitively", () => {
				const secondRow = { id: "234", title: "Big Hero 6", release_year: "2014" };
				const wrapper = mount({ data: [sampleRow, secondRow] });
				const vm = wrapper.vm;

				vm.searchQuery = "big hero";

				expect(vm.filteredRows).toHaveLength(1);
				expectToHaveRowWith(vm, "title", "Big Hero 6");
			});

			test("should contain no rows if a search term does not match", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.searchQuery = "not found";

				expect(vm.filteredRows).toEqual([]);
			});

			test("should only match a phrase against a single cell", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.searchQuery = "story 1995";

				expect(vm.filteredRows).toEqual([]);

				vm.searchQuery = "story1995";

				expect(vm.filteredRows).toEqual([]);

				vm.searchQuery = "story";

				expect(vm.filteredRows).toHaveLength(1);

				vm.searchQuery = "1995";

				expect(vm.filteredRows).toHaveLength(1);
			});
		});

		describe("haveDataToDisplay", () => {
			test("should return false if no data is provided", () => {
				const wrapper = mount({ data: [] });
				const vm = wrapper.vm;

				expect(vm.haveDataToDisplay).toBe(false);
			});

			test("should return true if no search term is present", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.haveDataToDisplay).toBe(true);
			});

			test("should return true if a search produces a result", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.searchQuery = "toy";

				expect(vm.haveDataToDisplay).toBe(true);
			});

			test("should be false if a search produces no results", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.searchQuery = "not found";

				expect(vm.haveDataToDisplay).toBe(false);
			});
		});

		describe("columnDefinitions", () => {
			test("should handle there being no data present", () => {
				const wrapper = mount({ data: [] });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({});
			});

			test("should determine which column is first, and which is last", () => {
				const data = [sampleRow];
				const columns = { id: { label: "ID" }, title: { label: "Title" }, release_year: { label: "Release year" } };
				const wrapper = mount({ data, columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
					id: { label: "ID", first: true, last: false },
					title: { label: "Title", first: false, last: false },
					release_year: { label: "Release year", first: false, last: true },
				});
			});

			test("should retrieve column configuration where found", () => {
				const data = [sampleRow];
				const columns = { title: { label: "Title" }, release_year: { label: "Release year", columnClasses: "text-right" } };
				const wrapper = mount({ data, columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
					title: {
						label: "Title",
						first: true,
						last: false,
					},
					release_year: {
						label: "Release year",
						first: false,
						last: true,
						columnClasses: "text-right",
					},
				});
			});

			test("should order columns by their order in configuration", () => {
				const data = [sampleRow];
				const columns = { release_year: { label: "Release year" }, title: { label: "Title" } };
				const wrapper = mount({ data, columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
					release_year: { label: "Release year", first: true, last: false },
					title: { label: "Title", first: false, last: true },
				});
			});

			test("should remove columns without configuration", () => {
				const data = [sampleRow];
				const columns = { title: { label: "Title" }, release_year: { label: "Release year" } };
				const wrapper = mount({ data, columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
					title: { label: "Title", first: true, last: false },
					release_year: { label: "Release year", first: false, last: true },
				});
			});

			test("should remove columns that are explicity marked as hidden", () => {
				const data = [sampleRow];
				const columns = { title: { label: "Title" }, release_year: { hidden: true } };
				const wrapper = mount({ data, columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
					title: { label: "Title", first: true, last: true },
				});
			});
		});
	});

	describe("Methods", () => {
		describe("resetSearchQuery", () => {
			test("should reset the current search query", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.searchQuery = "toy";

				vm.resetSearchQuery();

				expect(vm.searchQuery).toBe("");
			});
		});
	});
});

/**
 * Ensure that the given instance has a row containing the specified key and
 * value.
 */
function expectToHaveRowWith(vm, key, value) {
	const row = vm.internalData.find((row) => row.content[key] === value);

	return expect(row).toBeDefined();
}
