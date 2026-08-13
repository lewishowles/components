import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Temporal } from "temporal-polyfill";
import { nextTick } from "vue";
import FormDate from "./form-date.vue";

const mount = createMount(FormDate);
const deepMount = createDeepMount(FormDate);

const standardDate = { day: "01", month: "02", year: "2000" };
// Fixed date used by date-helper tests.
const fixedToday = Temporal.PlainDate.from("2025-06-15");

/** Make Temporal return the fixed date for the current test. */
function mockToday() {
	vi.spyOn(Temporal.Now, "plainDateISO").mockReturnValue(fixedToday);
}

describe("form-date", () => {
	console.warn = vi.fn();
	console.error = vi.fn();
	console.log = vi.fn();

	afterEach(() => {
		vi.restoreAllMocks();
	});

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
			const wrapper = mount({ modelValue: standardDate });
			const vm = wrapper.vm;

			expect(vm.date).toEqual(standardDate);
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

		test("should allow an initial date in ISO format", () => {
			const wrapper = mount({ modelValue: "2025-02-24" });
			const vm = wrapper.vm;

			expect(vm.date).toEqual({ day: "24", month: "2", year: "2025" });
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

			test("should reject the default empty date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.haveValidDate).toBe(false);
			});

			describe("should reject invalid date part values", () => {
				test.for([
					["string (empty)", ""],
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
			test("should accept a numeric string part", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.date = { day: "12" };

				expect(vm.initialiseDatePart("day")).toBe("12");
			});

			test("should accept a positive number part", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.date = { day: 12 };

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

		describe("toString", () => {
			test("should return a string date in RFC 9557 format", () => {
				const wrapper = mount({ modelValue: standardDate });
				const vm = wrapper.vm;

				expect(vm.toString()).toBe("2000-02-01");
			});

			test("should return nothing if the date is invalid", () => {
				const wrapper = mount({ modelValue: { day: "nine", month: "four", year: "9999" } });
				const vm = wrapper.vm;

				expect(vm.toString()).toBe("");
			});

			test("should return nothing for the default empty date", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.toString()).toBe("");
			});
		});

		describe("setDateFromIsoString", () => {
			test("should set a date from an string in RFC 9557 format", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.setDateFromIsoString("2010-05-26");

				expect(vm.date).toEqual({ day: "26", month: "5", year: "2010" });
			});

			test("should set a date from an string in RFC 9557 format including a time", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.setDateFromIsoString("2010-05-26T12:31:33");

				expect(vm.date).toEqual({ day: "26", month: "5", year: "2010" });
			});

			test("should not overwrite the current date if the string is invalid", () => {
				const wrapper = mount({ modelValue: standardDate });
				const vm = wrapper.vm;

				vm.setDateFromIsoString("invalid date");

				expect(vm.date).toEqual(standardDate);
			});
		});
	});

	describe("Computed", () => {
		describe("dateHelperItems", () => {
			test("should return an empty array without dateHelpers configured", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.dateHelperItems).toEqual([]);
			});

			test("should resolve a valid date helper relative to today", () => {
				mockToday();

				const wrapper = mount({ dateHelpers: [{ label: "Tomorrow", unit: "day", value: 1 }] });
				const vm = wrapper.vm;

				expect(vm.dateHelperItems).toHaveLength(1);
				expect(vm.dateHelperItems[0].label).toBe("Tomorrow");
				expect(vm.dateHelperItems[0].resolvedDate.toString()).toBe("2025-06-16");
				expect(vm.dateHelperItems[0].accessibleLabel).toContain("Tomorrow");
			});

			test("should support zero and negative values", () => {
				mockToday();

				const wrapper = mount({
					dateHelpers: [
						{ label: "Today", unit: "day", value: 0 },
						{ label: "Last week", unit: "week", value: -1 },
					],
				});

				const vm = wrapper.vm;

				expect(vm.dateHelperItems[0].resolvedDate.toString()).toBe("2025-06-15");
				expect(vm.dateHelperItems[1].resolvedDate.toString()).toBe("2025-06-08");
			});

			describe("should drop invalid entries", () => {
				test.for([
					["missing label", { unit: "day", value: 1 }],
					["empty label", { label: "", unit: "day", value: 1 }],
					["unsupported unit", { label: "Next decade", unit: "decade", value: 1 }],
					["non-integer value", { label: "Half a day", unit: "day", value: 0.5 }],
					["non-numeric value", { label: "Someday", unit: "day", value: "1" }],
					["non-object entry", "Today"],
					["null entry", null],
				])("%s", ([, dateHelper]) => {
					const wrapper = mount({ dateHelpers: [dateHelper] });
					const vm = wrapper.vm;

					expect(vm.dateHelperItems).toEqual([]);
				});
			});
		});
	});

	describe("Methods", () => {
		describe("applyDateHelper", () => {
			test("should set the current date and announce it", () => {
				mockToday();

				const wrapper = mount({ dateHelpers: [{ label: "Tomorrow", unit: "day", value: 1 }] });
				const vm = wrapper.vm;

				vm.applyDateHelper(vm.dateHelperItems[0]);

				expect(vm.date).toEqual({ day: "16", month: "6", year: "2025" });
				expect(vm.announcedDate).toBe(vm.dateHelperItems[0].displayDate);
			});

			test("should always resolve relative to today rather than the current value", () => {
				mockToday();

				const wrapper = mount({ dateHelpers: [{ label: "+2 days", unit: "day", value: 2 }] });
				const vm = wrapper.vm;

				vm.applyDateHelper(vm.dateHelperItems[0]);
				vm.applyDateHelper(vm.dateHelperItems[0]);

				expect(vm.date).toEqual({ day: "17", month: "6", year: "2025" });
			});
		});
	});

	describe("Props", () => {
		describe("required", () => {
			test("passes required to all date sub-inputs", () => {
				const wrapper = deepMount({ props: { required: true } });

				const inputs = wrapper.findAllComponents({ name: "FormInput" });

				expect(inputs.length).toBeGreaterThan(0);

				for (const input of inputs) {
					expect(input.props("required")).toBe(true);
				}
			});

			test("does not mark date sub-inputs as required by default", () => {
				const wrapper = deepMount();

				for (const input of wrapper.findAllComponents({ name: "FormInput" })) {
					expect(input.props("required")).toBe(false);
				}
			});
		});
	});

	describe("Slots", () => {
		describe("date-helper-status", () => {
			test("exposes the announced date as a scoped slot prop", async () => {
				mockToday();

				let receivedProps = null;

				const wrapper = deepMount({
					props: { dateHelpers: [{ label: "Tomorrow", unit: "day", value: 1 }] },
					slots: {
						"date-helper-status": (slotProps) => {
							receivedProps = slotProps;

							return "status";
						},
					},
				});

				expect(receivedProps).toMatchObject({ date: null });

				wrapper.vm.applyDateHelper(wrapper.vm.dateHelperItems[0]);
				await nextTick();

				expect(receivedProps).toMatchObject({ date: wrapper.vm.announcedDate });
			});
		});
	});
});
