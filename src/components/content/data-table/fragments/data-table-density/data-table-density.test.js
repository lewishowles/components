import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { createMount } from "@lewishowles/testing/vue";
import { nextTick, ref } from "vue";
import DataTableDensity from "./data-table-density.vue";

const global = {
	provide: {
		"data-table": {
			tableName: ref("sample-table"),
			haveTableName: ref(true),
			updateTableDensityOptions: vi.fn(),
		},
	},
};

const mount = createMount(DataTableDensity, { global });

describe("data-table-density", () => {
	afterEach(() => {
		localStorage.getItem.mockReturnValue(null);
		localStorage.removeItem.mockClear();
		localStorage.setItem.mockClear();
	});

	describe("Render contracts", () => {
		test("should retrieve a custom density from localStorage", () => {
			localStorage.getItem.mockReturnValue("compact");

			const wrapper = mount();

			expect(wrapper.emitted("update:modelValue")[0]).toEqual(["compact"]);
		});
	});

	describe("Methods", () => {
		describe("setTableDensity", () => {
			test("should update the selected table density", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(wrapper.emitted("update:modelValue")[0]).toEqual(["relaxed"]);

				vm.setTableDensity("standard");

				expect(wrapper.emitted("update:modelValue")[1]).toEqual(["standard"]);
			});

			test("should ignore an invalid density value", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(wrapper.emitted("update:modelValue")[0]).toEqual(["relaxed"]);

				vm.setTableDensity("invalid");

				expect(wrapper.emitted("update:modelValue")[1]).toBeUndefined();
			});

			describe("should ignore anything but a non-empty string density", () => {
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
					const wrapper = mount();
					const vm = wrapper.vm;

					expect(wrapper.emitted("update:modelValue")[0]).toEqual(["relaxed"]);

					vm.setTableDensity(input);

					expect(wrapper.emitted("update:modelValue")[1]).toBeUndefined();
				});
			});

			test("should store the selected table density", async () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.setTableDensity("compact");
				await nextTick();

				expect(localStorage.setItem).toHaveBeenCalledWith(
					"data-table:sample-table:density",
					"compact",
				);
			});

			test("should switch to the new table's stored density when the name changes", async () => {
				const tableName = ref("old-table");

				localStorage.getItem.mockImplementation((key) => {
					if (key === "data-table:new-table:density") {
						return "compact";
					}

					return null;
				});

				const wrapper = mount({
					global: {
						provide: {
							"data-table": {
								tableName,
								haveTableName: ref(true),
								updateTableDensityOptions: vi.fn(),
							},
						},
					},
				});

				localStorage.setItem.mockClear();
				tableName.value = "new-table";

				await nextTick();

				expect(wrapper.emitted("update:modelValue").at(-1)).toEqual(["compact"]);

				wrapper.vm.setTableDensity("standard");

				await nextTick();

				expect(localStorage.setItem).toHaveBeenCalledWith(
					"data-table:new-table:density",
					"standard",
				);
				expect(localStorage.setItem.mock.calls).not.toContainEqual([
					"data-table:old-table:density",
					"standard",
				]);
			});

			test("should start storing density once a table name becomes available", async () => {
				const tableName = ref(null);

				const wrapper = mount({
					global: {
						provide: {
							"data-table": {
								tableName,
								haveTableName: ref(false),
								updateTableDensityOptions: vi.fn(),
							},
						},
					},
				});

				tableName.value = "new-table";
				await nextTick();

				wrapper.vm.setTableDensity("compact");
				await nextTick();

				expect(localStorage.setItem).toHaveBeenCalledWith(
					"data-table:new-table:density",
					"compact",
				);
			});
		});
	});
});
