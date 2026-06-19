import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { ref } from "vue";
import DataTableColumns from "./data-table-columns.vue";

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

const modelValue = { title: true, release_year: true };
const global = { provide: { "data-table": { columnDefinitions } } };
const mount = createMount(DataTableColumns, { global, props: { modelValue } });

describe("data-table-columns", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("should receive column visibility", () => {
			const wrapper = mount();
			const vm = wrapper.vm;

			expect(vm.columnVisibility).toEqual({
				title: true,
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
