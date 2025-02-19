import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormSelect from "./form-select.vue";

const mount = createMount(FormSelect);

describe("form-select", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("internalOptions", () => {
			describe("should reject anything but a non-empty array options", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["array (empty)", []],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, options]) => {
					const wrapper = mount({ options });
					const vm = wrapper.vm;

					expect(vm.internalOptions).toEqual([]);
				});
			});

			test("should standardise string options", () => {
				const wrapper = mount({ options: ["one", "two"] });
				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([{ label: "one", value: "one" }, { label: "two", value: "two" }]);
			});

			test("should accept object options", () => {
				const wrapper = mount({ options: [{ label: "One", value: "1" }, { label: "Two", value: "2" }] });
				const vm = wrapper.vm;

				expect(vm.internalOptions).toEqual([{ label: "One", value: "1" }, { label: "Two", value: "2" }]);
			});

			describe("should reject invalid options", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["object (empty)", {}],
					["object (no label)", { value: "value" }],
					["object (no value)", { label: "label" }],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const wrapper = mount({ options: [input] });
					const vm = wrapper.vm;

					expect(vm.internalOptions).toEqual([]);
				});
			});
		});
	});
});
