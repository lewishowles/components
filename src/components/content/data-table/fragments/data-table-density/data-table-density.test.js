import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { createMount } from "@unit/support/mount";
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
		});
	});
});
