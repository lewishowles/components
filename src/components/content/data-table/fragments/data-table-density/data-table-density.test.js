import { createMount } from "@unit/support/mount";
import { afterEach, describe, expect, test, vi } from "vitest";
import DataTableDensity from "./data-table-density.vue";

const defaultProps = { name: "sample-table" };
const global = { provide: { "data-table": { setTableDensityOptions: vi.fn() } } };
const mount = createMount(DataTableDensity, { props: defaultProps, global });

describe("data-table-density", () => {
	afterEach(() => {
		localStorage.removeItem("data-table:sample-table:density");
	});

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
	});
});
