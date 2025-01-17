import DataTable from "./data-table.vue";
import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import { get } from "@lewishowles/helpers/object";

const sampleRow = { id: "123", title: "Toy Story", release_year: "1995" };
const defaultProps = { data: [sampleRow] };
const mount = createMount(DataTable, { props: defaultProps });

describe("data-table", () => {
	const sampleStandardisedRow = {
		id: {
			configuration: {
				searchable: "123",
				sortable: "123",
			},
			content: "123",
		},
		title: {
			configuration: {
				searchable: "toy story",
				sortable: "toy story",
			},
			content: "Toy Story",
		},
		release_year: {
			configuration: {
				searchable: "1995",
				sortable: "1995",
			},
			content: "1995",
		},
	};

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
							content: sampleStandardisedRow,
							raw: sampleRow,
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

			test("should skip a column if that column is marked as not searchable", () => {
				const wrapper = mount({ columns: { title: { searchable: false } } });
				const vm = wrapper.vm;

				vm.searchQuery = "Toy Story";

				expect(vm.filteredRows).toEqual([]);
			});

			test("should defer to searchableContentCallback if defined", () => {
				const searchableContentCallback = columnKey => {
					if (columnKey === "title") {
						return "abcdef";
					}
				};

				const wrapper = mount({ searchableContentCallback });
				const vm = wrapper.vm;

				vm.searchQuery = "abcdef";

				expect(vm.filteredRows).toHaveLength(1);

				vm.searchQuery = "1995";

				expect(vm.filteredRows).toHaveLength(1);

				vm.searchQuery = "Toy Story";

				expect(vm.filteredRows).toEqual([]);
			});
		});

		describe("sortedRows", () => {
			test("should sort rows by their content", () => {
				const wrapper = mount({
					data: [
						sampleRow,
						{ id: "234", title: "Big Hero 6", release_year: "2014" },
					],
					columns: {
						title: { label: "Title" },
					},
				});

				const vm = wrapper.vm;

				vm.sortColumn("title");

				expect(vm.sortedRows[0].content.title.content).toBe("Big Hero 6");
				expect(vm.sortedRows[1].content.title.content).toBe("Toy Story");

				vm.sortColumn("title");

				expect(vm.sortedRows[0].content.title.content).toBe("Toy Story");
				expect(vm.sortedRows[1].content.title.content).toBe("Big Hero 6");
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
				const columns = { id: { label: "ID" }, title: { label: "Title" }, release_year: { label: "Release year" } };
				const wrapper = mount({ columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
					id: {
						label: "ID",
						first: true,
						last: false,
						sortable: true,
					},
					title: {
						label: "Title",
						first: false,
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
			});

			test("should retrieve column configuration where found", () => {
				const columns = { title: { label: "Title" }, release_year: { label: "Release year", columnClasses: "text-right" } };
				const wrapper = mount({ columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
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
					release_year: {
						label: "Release year",
						first: true,
						last: false,
						sortable: true,
					},
					title: {
						label: "Title",
						first: false,
						last: true,
						sortable: true,
					},
				});
			});

			test("should remove columns without configuration", () => {
				const data = [sampleRow];
				const columns = { title: { label: "Title" }, release_year: { label: "Release year" } };
				const wrapper = mount({ data, columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
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
			});

			test("should remove columns that are explicity marked as hidden", () => {
				const data = [sampleRow];
				const columns = { title: { label: "Title" }, release_year: { hidden: true } };
				const wrapper = mount({ data, columns });
				const vm = wrapper.vm;

				expect(vm.columnDefinitions).toEqual({
					title: {
						label: "Title",
						first: true,
						last: true,
						sortable: true,
					},
				});
			});
		});
	});

	describe("Methods", () => {
		describe("getRowContent", () => {
			test("should return the content of a row", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const row = vm.internalData[0];
				const content = vm.getRowContent(row, "title");

				expect(content).toEqual("Toy Story");
			});

			describe("should ignore non-string cell content", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const wrapper = mount({ data: [{ id: input }] });
					const vm = wrapper.vm;

					const row = vm.internalData[0];
					const content = vm.getRowContent(row, "id");

					expect(content).toEqual("");
				});
			});
		});

		describe("getSearchableContent", () => {
			test("should return the searchable content of a row", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const row = vm.internalData[0];

				const content = vm.getSearchableContent(row.raw, "title");

				expect(content).toEqual("toy story");
			});

			describe("should ignore non-string cell content", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const wrapper = mount({ data: [{ id: input }] });
					const vm = wrapper.vm;

					const row = vm.internalData[0];
					const content = vm.getSearchableContent(row.raw, "id");

					expect(content).toEqual("");
				});
			});

			test("should defer to searchableContentCallback if defined", () => {
				const searchableContentCallback = columnKey => {
					if (columnKey === "title") {
						return "abcdef";
					}
				};

				const wrapper = mount({ searchableContentCallback });
				const vm = wrapper.vm;

				const row = vm.internalData[0];
				const content = vm.getSearchableContent(row, "title");

				expect(content).toEqual("abcdef");
			});
		});

		describe("getSortableContent", () => {
			test("should return the sortable content of a row", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const row = vm.internalData[0];
				const content = vm.getSortableContent(row.raw, "title");

				expect(content).toEqual("toy story");
			});

			test("should defer to sortableContentCallback if defined", () => {
				const sortableContentCallback = columnKey => {
					if (columnKey === "title") {
						return "abcdef";
					}
				};

				const wrapper = mount({ sortableContentCallback });
				const vm = wrapper.vm;

				const row = vm.internalData[0];
				const content = vm.getSortableContent(row, "title");

				expect(content).toEqual("abcdef");
			});
		});

		describe("getRawRow", () => {
			test("should retrieve the original raw row data", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				const row = vm.internalData[0];

				expect(vm.getRawRow(row)).toEqual(sampleRow);
			});
		});

		describe("setSearchQuery", () => {
			test("should update the current search query", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.setSearchQuery("Moana");

				expect(vm.searchQuery).toBe("Moana");
			});

			describe("should not update the search query if an invalid input is provided", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["array (empty)", []],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					vm.setSearchQuery(input);

					expect(vm.searchQuery).toBe("");
				});
			});
		});

		describe("resetSearchQuery", () => {
			test("should reset the current search query", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.searchQuery = "toy";

				vm.resetSearchQuery();

				expect(vm.searchQuery).toBe("");
			});
		});

		describe("sortColumn", () => {
			const columns = { title: { label: "Title" }, release_year: { label: "Release year" } };

			test("should sort the given column", () => {
				const wrapper = mount({ columns });
				const vm = wrapper.vm;

				vm.sortColumn("title");

				expect(vm.sortedColumn).toBe("title");
			});

			test("should reverse the direction of a search for the same column", () => {
				const wrapper = mount({ columns });
				const vm = wrapper.vm;

				vm.sortColumn("title");

				expect(vm.sortedColumn).toBe("title");
				expect(vm.sortDirection).toBe(1);

				vm.sortColumn("title");

				expect(vm.sortedColumn).toBe("title");
				expect(vm.sortDirection).toBe(-1);
			});

			test("should ignore an unknown column", () => {
				const wrapper = mount({ columns });
				const vm = wrapper.vm;

				vm.sortColumn("column");

				expect(vm.sortedColumn).toBe(null);
			});
		});

		describe("getColumnSortDirection", () => {
			test("should detect a column that is sorted ascending", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.sortedColumn = "title";
				vm.sortDirection = 1;

				expect(vm.getColumnSortDirection("title")).toBe("ascending");
			});

			test("should detect a column that is sorted descending", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.sortedColumn = "title";
				vm.sortDirection = -1;

				expect(vm.getColumnSortDirection("title")).toBe("descending");
			});

			test("should detect a column that is not sorted", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.sortedColumn = "title";
				vm.sortDirection = -1;

				expect(vm.getColumnSortDirection("unknown")).toBe(null);
			});
		});

		describe("getSortIcon", () => {
			test("should detect a column that is sorted ascending", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.sortedColumn = "title";
				vm.sortDirection = 1;

				expect(vm.getSortIcon("title")).toBe("icon-arrow-down");
			});

			test("should detect a column that is sorted descending", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.sortedColumn = "title";
				vm.sortDirection = -1;

				expect(vm.getSortIcon("title")).toBe("icon-arrow-up");
			});

			test("should detect a column that is not sorted", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.sortedColumn = "title";
				vm.sortDirection = -1;

				expect(vm.getSortIcon("unknown")).toBe(null);
			});
		});
	});
});

/**
 * Ensure that the given instance has a row containing the specified key and
 * value.
 */
function expectToHaveRowWith(vm, key, value) {
	const row = vm.internalData.find(row => get(row, `content.${key}.content`) === value);

	return expect(row).toBeDefined();
}
