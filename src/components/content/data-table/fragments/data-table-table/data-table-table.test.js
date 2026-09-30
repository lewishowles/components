import { createDeepMount } from "@lewishowles/testing/vue";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { defineComponent, h, nextTick, provide, ref } from "vue";

import DataTableTable from "./data-table-table.vue";

// A row as the user passes it to data-table.
const sampleRow = { id: "123", title: "Toy Story", release_year: "1995" };

/**
 * Give a raw row the fields that the table's data composable normally supplies.
 *
 * @param  {object}  raw
 *     The original row passed by a consumer.
 * @param  {object}  cells
 *     The column keys and display values to render.
 */
function makeRow(raw, cells = raw) {
	return {
		configuration: { id: raw.id ?? "row-1" },
		content: Object.fromEntries(Object.entries(cells).map(([key, content]) => [key, { content }])),
		raw,
	};
}

/**
 * Give a table heading the column settings its template reads.
 *
 * @param  {string}  label
 *     The text used when no heading slot is provided.
 * @param  {object}  options
 *     Column settings that differ from the default.
 */
function makeColumn(label, options = {}) {
	return { label, first: true, last: true, sortable: true, ...options };
}

/**
 * Provide the fragment's table state without mounting its parent component.
 *
 * @param  {object}  options
 *     State overrides and user slots for the test.
 */
function mountTable(options = {}) {
	const context = {
		visibleColumnDefinitions: ref({ title: makeColumn("Title") }),
		paginatedRows: ref([makeRow(sampleRow)]),
		haveTableContent: ref(true),
		enableSort: ref(true),
		enableSelection: ref(false),
		sortedColumn: ref(null),
		isAscending: ref(true),
		isLoading: ref(false),
		haveError: ref(false),
		error: ref(null),
		errorMessage: ref("Unable to load data."),
		overflowLabel: ref(null),
		selectAllIndeterminate: ref(false),
		stateRowColumnCount: ref(1),
		selectAllRows: ref(false),
		selectedRowIds: ref([]),
		...options.context,
	};

	context.getColumnLabel = (key) => context.visibleColumnDefinitions.value[key]?.label;
	context.getColumnSortDirection = (key) => {
		if (!context.enableSort.value || context.sortedColumn.value !== key) {
			return null;
		}

		return context.isAscending.value ? "ascending" : "descending";
	};
	context.getHeadingClasses = () => "";
	context.getCellClasses = () => "";
	context.getSortIcon = () => null;
	context.sortColumn = vi.fn((key) => {
		if (context.sortedColumn.value === key) {
			context.isAscending.value = !context.isAscending.value;
		} else {
			context.sortedColumn.value = key;
			context.isAscending.value = true;
		}
	});
	context.toggleAllRows = vi.fn();

	// Vue expects named slots passed through h() to be functions.
	const slots = Object.fromEntries(
		Object.entries(options.slots || {}).map(([name, content]) => [
			name,
			typeof content === "function" ? content : () => content,
		]),
	);

	const host = defineComponent({
		setup() {
			provide("data-table", context);

			return () => h(DataTableTable, null, slots);
		},
	});

	const wrapper = createDeepMount(host)().getComponent(DataTableTable);

	return { context, wrapper };
}

describe("data-table-table", () => {
	afterEach(() => vi.restoreAllMocks());

	describe("Render", () => {
		test("gives every table part an explicit role so the card layout keeps table semantics", () => {
			const { wrapper } = mountTable({
				context: {
					enableSelection: ref(true),
					visibleColumnDefinitions: ref({
						title: makeColumn("Title", { primary: true, last: false }),
						year: makeColumn("Year", { first: false, sortable: false }),
					}),
					paginatedRows: ref([makeRow(sampleRow, { title: "Toy Story", year: "1995" })]),
				},
			});

			for (const [selector, role] of [
				["table", "table"],
				["thead, tbody", "rowgroup"],
				["tr", "row"],
				["thead th", "columnheader"],
				["tbody th", "rowheader"],
				["td", "cell"],
			]) {
				for (const element of wrapper.findAll(selector)) {
					expect(element.attributes("role")).toBe(role);
				}
			}
		});

		test.each([
			["loading", "isLoading"],
			["error", "haveError"],
		])("keeps roles on the %s row", (_name, state) => {
			const { wrapper } = mountTable({ context: { [state]: ref(true) } });
			const row = wrapper.get("tbody tr");

			expect(row.attributes("role")).toBe("row");
			expect(row.get("td").attributes("role")).toBe("cell");
		});

		test("keeps the configured label in sortable headings with a custom heading slot", () => {
			const { wrapper } = mountTable({ slots: { title_heading: "Film title" } });
			const heading = wrapper.get('[data-test="data-table-heading"]');

			expect(heading.get('[data-test="data-table-card-heading"]').text()).toBe("Title");
			expect(heading.get('[data-test="data-table-sort"]').text()).toContain("Film title");
		});

		test("shows each configured column label in cards, ignoring custom heading content, hidden from screen readers", () => {
			const { wrapper } = mountTable({
				context: {
					enableSelection: ref(true),
					visibleColumnDefinitions: ref({
						title: makeColumn("Title", { primary: true, last: false }),
						year: makeColumn("Release year", { first: false, sortable: false }),
					}),
					paginatedRows: ref([makeRow(sampleRow, { title: "Toy Story", year: "1995" })]),
				},
				slots: { title_heading: "Film title", year_heading: "Film year" },
			});

			const labels = wrapper.findAll('[data-test="data-table-field-label"]');

			expect(labels.map((label) => label.text())).toEqual(["Title", "Release year"]);
			expect(labels.every((label) => label.attributes("aria-hidden") === "true")).toBe(true);
		});

		test("shows the caption sort hint only while sorting is enabled", async () => {
			const { context, wrapper } = mountTable({ slots: { caption: "Films" } });
			const caption = wrapper.get("caption");

			expect(caption.text()).toBe("Films");

			await wrapper.get('[data-test="data-table-sort"]').trigger("click");

			expect(context.sortColumn).toHaveBeenCalledWith("title");
			expect(caption.text()).toContain("Sorted by Title ascending");

			context.enableSort.value = false;

			await nextTick();

			expect(caption.text()).toBe("Films");
		});

		test("hides sort controls when sorting is disabled", () => {
			const { wrapper } = mountTable({
				context: { enableSort: ref(false) },
				slots: { caption: "Films", "sort-instruction": "Sort this column" },
			});

			expect(wrapper.find('[data-test="data-table-sort"]').exists()).toBe(false);

			expect(
				wrapper.get('[data-test="data-table-heading"]').attributes("aria-sort"),
			).toBeUndefined();

			expect(wrapper.text()).not.toContain("Sort this column");
			expect(wrapper.text()).not.toContain("Sorted by");
		});

		test("hides a controlled server sort while sorting is disabled", () => {
			const { wrapper } = mountTable({ context: { enableSort: ref(false) } });

			expect(
				wrapper.get('[data-test="data-table-heading"]').attributes("aria-sort"),
			).toBeUndefined();

			expect(wrapper.find('[data-test="data-table-sort"]').exists()).toBe(false);
		});

		test("passes cell content and the original row to a cell slot", () => {
			const rawRow = { address: { city: "Bristol" } };

			let receivedCell;
			let receivedRow;

			const { context, wrapper } = mountTable({
				context: {
					visibleColumnDefinitions: ref({ city: makeColumn("City") }),
					paginatedRows: ref([makeRow(rawRow, { city: "Bristol" })]),
				},
				slots: {
					city: ({ cell, row }) => {
						receivedCell = cell;
						receivedRow = row;

						return cell;
					},
				},
			});

			expect(receivedCell).toBe("Bristol");
			expect(receivedRow).toBe(context.paginatedRows.value[0].raw);
			expect(receivedRow).toEqual(rawRow);
			expect(wrapper.get('[data-test="data-table-field-value"]').text()).toBe("Bristol");
		});

		test("renders the actions slot in the injected column", () => {
			const { wrapper } = mountTable({
				context: {
					visibleColumnDefinitions: ref({
						title: makeColumn("Title", { last: false }),
						actions: makeColumn("Actions", {
							first: false,
							sortable: false,
							visuallyHiddenHeading: true,
						}),
					}),
					paginatedRows: ref([makeRow(sampleRow, { title: sampleRow.title, actions: "" })]),
				},
				slots: { actions: ({ row }) => row.id || "Actions" },
			});

			expect(
				wrapper.findAll('[data-test="data-table-heading"]').at(-1).get(".sr-only").text(),
			).toBe("Actions");

			const cells = wrapper.findAll('[data-test="data-table-cell"]');

			expect(
				cells
					.at(cells.length - 1)
					.get('[data-test="data-table-field-value"]')
					.text(),
			).toBe(sampleRow.id);
		});

		test("renders an actions heading slot visibly in the injected column", () => {
			const { wrapper } = mountTable({
				context: {
					visibleColumnDefinitions: ref({
						title: makeColumn("Title", { last: false }),
						actions: makeColumn("Actions", {
							first: false,
							sortable: false,
							visuallyHiddenHeading: true,
						}),
					}),
				},
				slots: { actions: ({ row }) => row.id, actions_heading: "Row actions" },
			});

			const actionHeading = wrapper.findAll('[data-test="data-table-heading"]').at(-1);

			expect(actionHeading.text()).toBe("Row actions");
			expect(actionHeading.find(".sr-only").exists()).toBe(false);
		});

		test.each([true, false])(
			"passes the column key and configured label to a heading slot when sortable is %s",
			(sortable) => {
				let headingProps;

				const { wrapper } = mountTable({
					context: {
						visibleColumnDefinitions: ref({ title: makeColumn("Film title", { sortable }) }),
					},
					slots: {
						title_heading: (slotProps) => {
							headingProps = slotProps;

							return `Custom ${slotProps.label}`;
						},
					},
				});

				expect(headingProps).toMatchObject({ key: "title", label: "Film title" });

				expect(wrapper.get('[data-test="data-table-heading"]').text()).toContain(
					"Custom Film title",
				);
			},
		);

		test("renders an explicit actions column with a visible heading", () => {
			const { wrapper } = mountTable({
				context: {
					visibleColumnDefinitions: ref({
						title: makeColumn("Title", { last: false }),
						actions: makeColumn("More", { first: false, sortable: false }),
					}),
				},
				slots: { actions: ({ row }) => row.id },
			});

			const actionHeading = wrapper.findAll('[data-test="data-table-heading"]').at(-1);

			expect(actionHeading.text()).toBe("More");
			expect(actionHeading.find(".sr-only").exists()).toBe(false);
		});

		test("renders only the columns it is given", () => {
			const { wrapper } = mountTable({
				slots: { actions: ({ row }) => row.id || "Actions" },
			});

			expect(wrapper.findAll('[data-test="data-table-heading"]')).toHaveLength(1);
			expect(wrapper.findAll('[data-test="data-table-cell"]')).toHaveLength(1);
		});

		test("passes a dotted column key value and the original row to a cell slot", () => {
			const rawRow = { address: { city: "Bristol" } };

			let receivedCell;
			let receivedRow;

			const { context, wrapper } = mountTable({
				context: {
					visibleColumnDefinitions: ref({ "address.city": makeColumn("City") }),
					paginatedRows: ref([makeRow(rawRow, { "address.city": "Bristol" })]),
				},
				slots: {
					"address.city": ({ cell, row }) => {
						receivedCell = cell;
						receivedRow = row;

						return cell;
					},
				},
			});

			expect(receivedCell).toBe("Bristol");
			expect(receivedRow).toBe(context.paginatedRows.value[0].raw);
			expect(receivedRow).toEqual(rawRow);
			expect(wrapper.get('[data-test="data-table-field-value"]').text()).toBe("Bristol");
		});

		test("should expose separate scroll indicator and scroll region hooks", () => {
			const { wrapper } = mountTable();
			const scrollIndicators = wrapper.get('[data-part="scroll-indicators"]');
			const scrollRegion = wrapper.get('[data-part="scroll-region"]');

			expect(scrollIndicators.classes()).not.toContain("overflow-x-auto");
			expect(scrollRegion.classes()).toContain("overflow-x-auto");
		});

		test("should label an overflowing wrapper with overflowLabel", async () => {
			const { wrapper } = mountTable({ context: { overflowLabel: ref("Scrollable table") } });

			wrapper.vm.isOverflowing = true;

			await nextTick();

			const scrollWrapper = wrapper.find(".overflow-x-auto");

			expect(scrollWrapper.attributes("role")).toBe("region");
			expect(scrollWrapper.attributes("aria-label")).toBe("Scrollable table");
		});

		test("should omit the region role and label when overflowing without a label", async () => {
			const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
			const { wrapper } = mountTable();

			wrapper.vm.isOverflowing = true;

			await nextTick();

			const scrollWrapper = wrapper.find(".overflow-x-auto");

			expect(scrollWrapper.attributes("role")).toBeUndefined();
			expect(scrollWrapper.attributes("aria-label")).toBeUndefined();
			expect(scrollWrapper.attributes("tabindex")).toBe("0");

			expect(warning).toHaveBeenCalledWith(
				"[data-table] An overflowing table needs a caption or `overflowLabel` to label its scroll region.",
			);
		});
	});

	describe("getSortInstruction", () => {
		test("prompts to sort an unsorted column", () => {
			const { wrapper } = mountTable();

			expect(wrapper.vm.getSortInstruction("title")).toBe("(sortable: activate to sort ascending)");
		});

		test("describes the ascending state and offers descending", async () => {
			const { context, wrapper } = mountTable();

			context.sortColumn("title");

			await nextTick();

			expect(wrapper.vm.getSortInstruction("title")).toBe(
				"(sorted ascending: activate to sort descending)",
			);
		});

		test("describes the descending state and offers ascending", async () => {
			const { context, wrapper } = mountTable();

			context.sortColumn("title");
			context.sortColumn("title");

			await nextTick();

			expect(wrapper.vm.getSortInstruction("title")).toBe(
				"(sorted descending: activate to sort ascending)",
			);
		});
	});
});
