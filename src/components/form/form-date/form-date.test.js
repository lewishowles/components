import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import FormDate from "./form-date.vue";

const mount = createMount(FormDate);

describe("form-date", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		describe("should reset any non-empty object model", () => {
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
			])("%s", ([, input]) => {
				const wrapper = mount({ modelValue: input });
				const vm = wrapper.vm;

				expect(vm.date).toEqual({ day: "", month: "", year: "" });
			});
		});

		test("should allow string date components", () => {
			const wrapper = mount({ modelValue: { day: "01", month: "02", year: "2000" } });
			const vm = wrapper.vm;

			expect(vm.date).toEqual({ day: "01", month: "02", year: "2000" });
		});

		test("should allow number date components", () => {
			const wrapper = mount({ modelValue: { day: 1, month: 2, year: 2000 } });
			const vm = wrapper.vm;

			expect(vm.date).toEqual({ day: "1", month: "2", year: "2000" });
		});

		describe("should reset anything but a string or positive number date component", () => {
			test.for([
				["boolean (true)", true],
				["boolean (false)", false],
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
				const wrapper = mount({ modelValue: { day: input, month: input, year: input } });
				const vm = wrapper.vm;

				expect(vm.date).toEqual({ day: "", month: "", year: "" });
			});
		});
	});

	describe("Computed", () => {
		describe("haveValidDate", () => {
			describe("should handle anything but a non-empty object date", () => {
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
				])("%s", ([, input]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					vm.date = input;

					expect(vm.haveValidDate).toBe(false);
				});
			});

			test("should allow string date parts", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.date = { day: "1", month: "1", year: "2000" };

				expect(vm.haveValidDate).toBe(true);
			});

			test("should allow number date parts", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.date = { day: 1, month: 1, year: 2000 };

				expect(vm.haveValidDate).toBe(true);
			});

			describe("should reject invalid date part values", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, input]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					vm.date = { day: "1", month: "2", year: "2000" };

					expect(vm.haveValidDate).toBe(true);

					vm.date = { day: input, month: "2", year: "2000" };

					expect(vm.haveValidDate).toBe(false);

					vm.date = { day: "1", month: input, year: "2000" };

					expect(vm.haveValidDate).toBe(false);

					vm.date = { day: "1", month: "2", year: input };

					expect(vm.haveValidDate).toBe(false);

					vm.date = { day: "1", month: "2", year: "2000" };

					expect(vm.haveValidDate).toBe(true);
				});
			});
		});
	});

	describe("Methods", () => {
		describe("initialiseDatePart", () => {
			test.only("should accept a numeric string part", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.date = { day: "12" };

				expect(vm.initialiseDatePart("day")).toBe("12");
			});

			test("should accept a positive number part", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.date = { day: 1 };

				expect(vm.initialiseDatePart("day")).toBe("12");
			});

			test("should reject a non-numeric string part", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.date = { day: "string" };

				expect(vm.initialiseDatePart("day")).toBe("");

				vm.date = { day: "1234string" };

				expect(vm.initialiseDatePart("day")).toBe("");
			});

			test("should reject a zero or negative number part", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.date = { day: 0 };

				expect(vm.initialiseDatePart("day")).toBe("");

				vm.date = { day: -1 };

				expect(vm.initialiseDatePart("day")).toBe("");
			});

			describe("should reject any other type of date part", () => {
				test.for([
					["boolean (true)", true],
					["boolean (false)", false],
					["number (NaN)", NaN],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, part]) => {
					const wrapper = mount();
					const vm = wrapper.vm;

					vm.date = { day: part };

					expect(vm.initialiseDatePart("day")).toBe("");
				});
			});
		});
	});
});
