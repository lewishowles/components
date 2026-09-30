import { createDeepMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";
import { defineComponent, h, nextTick, provide, ref } from "vue";

import DataTableCardControls from "./data-table-card-controls.vue";

/**
 * Mount card controls with the state shared by the table and its headings.
 *
 * @param  {object}  overrides
 *     Changes to the table state for a test.
 *
 * @returns  {object}
 *     The shared table state, including spies for its actions, and the mounted controls.
 */
function mountControls(overrides = {}) {
	const state = {
		enableSelection: ref(false),
		enableSort: ref(true),
		isAscending: ref(true),
		selectAllIndeterminate: ref(false),
		selectAllRows: ref(false),
		sortedColumn: ref(null),
		visibleColumnDefinitions: ref({
			title: { label: "Title", sortable: true },
			year: { label: "Release year", sortable: false },
		}),
		...overrides,
	};

	state.sortColumn = vi.fn((key) => {
		if (state.sortedColumn.value === key) {
			state.isAscending.value = !state.isAscending.value;
		} else {
			state.sortedColumn.value = key;
			state.isAscending.value = true;
		}
	});
	state.toggleAllRows = vi.fn();

	const host = defineComponent({
		setup() {
			provide("data-table", state);

			return () => h(DataTableCardControls);
		},
	});

	return { state, wrapper: createDeepMount(host)().getComponent(DataTableCardControls) };
}

describe("data-table-card-controls", () => {
	describe("Sorting", () => {
		test("lists only sortable columns and omits the direction before sorting", () => {
			const { wrapper } = mountControls();
			const options = wrapper.findAll('[data-test="data-table-card-sort-column"] option');

			expect(options.map((option) => option.text())).toEqual(["Sort by", "Title"]);
			expect(wrapper.find('[data-test="data-table-card-sort-direction"]').exists()).toBe(false);
			expect(wrapper.get('[data-test="data-table-card-controls"]').attributes("data-part")).toBe(
				"card-controls",
			);
		});

		test("omits the empty sort option when a column is already selected", () => {
			const { wrapper } = mountControls({ sortedColumn: ref("title") });
			const options = wrapper.findAll('[data-test="data-table-card-sort-column"] option');

			expect(options.map((option) => option.text())).toEqual(["Title"]);
		});

		test("keeps a sort on the second column when the controls mount", () => {
			const { state, wrapper } = mountControls({
				sortedColumn: ref("year"),
				visibleColumnDefinitions: ref({
					title: { label: "Title", sortable: true },
					year: { label: "Release year", sortable: true },
				}),
			});

			const select = wrapper.get('[data-test="data-table-card-sort-column"] select');

			expect(select.element.value).toBe("year");
			expect(state.sortColumn).not.toHaveBeenCalled();
		});

		test("chooses a column and toggles its direction through the table action", async () => {
			const { state, wrapper } = mountControls();
			const select = wrapper.get('[data-test="data-table-card-sort-column"] select');

			await select.setValue("title");

			const direction = wrapper.get('[data-test="data-table-card-sort-direction"]');
			const options = wrapper.findAll('[data-test="data-table-card-sort-column"] option');

			expect(state.sortColumn).toHaveBeenCalledWith("title");
			expect(state.sortedColumn.value).toBe("title");
			expect(options.map((option) => option.text())).toEqual(["Title"]);
			expect(direction.text()).toMatch(/Sort direction:\s+Ascending/);

			await direction.trigger("click");

			expect(state.sortColumn).toHaveBeenLastCalledWith("title");
			expect(direction.text()).toMatch(/Sort direction:\s+Descending/);
		});
	});

	describe("Selection", () => {
		test("shares checked and mixed state with the table select-all action", async () => {
			const { state, wrapper } = mountControls({ enableSelection: ref(true) });
			const checkbox = wrapper.get('[data-test="data-table-card-select-all-rows"] input');

			state.selectAllIndeterminate.value = true;
			await nextTick();

			expect(checkbox.element.indeterminate).toBe(true);

			await checkbox.setValue(true);

			expect(state.toggleAllRows).toHaveBeenCalledOnce();
			expect(state.selectAllRows.value).toBe(true);
		});
	});

	test("omits controls when sorting and selection are disabled", () => {
		const { wrapper } = mountControls({ enableSort: ref(false) });

		expect(wrapper.find('[data-test="data-table-card-controls"]').exists()).toBe(false);
	});

	test("omits an empty controls container when no visible column is sortable", () => {
		const { wrapper } = mountControls({
			visibleColumnDefinitions: ref({ year: { label: "Release year", sortable: false } }),
		});

		expect(wrapper.find('[data-test="data-table-card-controls"]').exists()).toBe(false);
	});

	test("omits sorting when only selection is enabled", () => {
		const { wrapper } = mountControls({
			enableSelection: ref(true),
			enableSort: ref(false),
		});

		expect(wrapper.find('[data-test="data-table-card-sort-column"]').exists()).toBe(false);
		expect(wrapper.find('[data-test="data-table-card-select-all-rows"]').exists()).toBe(true);
	});
});
