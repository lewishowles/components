import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import DisplayDate from "./display-date.vue";

const defaultProps = { date: "2025-03-29" };
const mount = createMount(DisplayDate, { props: defaultProps });

describe("display-date", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("temporalClass", () => {
			describe("should return null if `date` is not a non-empty string", () => {
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
				])("%s", ([, date]) => {
					const wrapper = mount({ date });
					const vm = wrapper.vm;

					expect(vm.temporalClass).toBeNull();
				});
			});

			test("should return `ZonedDateTime` for a string that appears to have a time zone component", () => {
				const wrapper = mount({ date: "2025-03-29[America/New_York]" });
				const vm = wrapper.vm;

				expect(vm.temporalClass).toBe("ZonedDateTime");
			});

			test("should return `PlainDateTime` for a string that appears to have a time component", () => {
				const wrapper = mount({ date: "2025-03-29T13:15:20" });
				const vm = wrapper.vm;

				expect(vm.temporalClass).toBe("PlainDateTime");
			});

			test("should return `PlainDate` for a basic date", () => {
				const wrapper = mount({ date: "2025-03-29" });
				const vm = wrapper.vm;

				expect(vm.temporalClass).toBe("PlainDate");
			});
		});

		describe("displayDate", () => {
			describe("should return null if `date` is not a non-empty string", () => {
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
				])("%s", ([, date]) => {
					const wrapper = mount({ date });
					const vm = wrapper.vm;

					expect(vm.displayDate).toBeNull();
				});
			});

			test("should return null if `Temporal.PlainDate` throws an error", () => {
				const wrapper = mount({ date: "invalid-date" });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBeNull();
			});

			test("should return a locale-formatted date string by default", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29/03/2025");
			});

			test("should format a time-zoned date", () => {
				const wrapper = mount({ date: "2025-03-29[America/New_York]" });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29/03/2025, 0:00:00 GMT-4");
			});

			test("should format a date time", () => {
				const wrapper = mount({ date: "2025-03-29T13:15:20" });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29/03/2025, 13:15:20");
			});

			test("should allow a custom locale to be provided", () => {
				const wrapper = mount({ locale: "de-DE" });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29.3.2025");
			});

			test("should allow custom formatting options to be provided", () => {
				const format = {
					year: "numeric",
					day: "2-digit",
					weekday: "long",
					month: "long",
					hour: "numeric",
					dayPeriod: "long",
					minute: "numeric",
				};

				const wrapper = mount({ date: "2025-03-29T13:15:20", format });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("Saturday, 29 March 2025 at 13:15");
			});

			test("should allow both a custom locale and custom formatting options to be provided", () => {
				const format = {
					year: "numeric",
					day: "2-digit",
					weekday: "long",
					month: "long",
					hour: "numeric",
					dayPeriod: "long",
					minute: "numeric",
				};

				const wrapper = mount({ date: "2025-03-29T13:15:20", locale: "de-DE", format });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("Samstag, 29. März 2025 um 13:15");
			});
		});
	});
});
