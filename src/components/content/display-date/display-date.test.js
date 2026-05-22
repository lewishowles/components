import { createMount } from "@unit/support/mount";
import { Temporal } from "temporal-polyfill";
import { describe, expect, test, vi } from "vitest";

import DisplayDate from "./display-date.vue";

const defaultProps = { date: "2025-03-29", locale: "en-GB" };
const mount = createMount(DisplayDate, { props: defaultProps });

describe("display-date", () => {
	console.error = vi.fn();
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("temporalDate", () => {
			test("should convert a Date instance to a PlainDateTime", () => {
				const wrapper = mount({ date: new Date(2025, 2, 29, 13, 15, 20) });
				const vm = wrapper.vm;

				expect(vm.temporalDate).toBeInstanceOf(Temporal.PlainDateTime);
				expect(vm.temporalDate.toString()).toBe("2025-03-29T13:15:20");
			});

			describe("should return null for unsupported values", () => {
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
				])("%s", ([, date]) => {
					const wrapper = mount({ date });
					const vm = wrapper.vm;

					expect(vm.temporalDate).toBeNull();
				});
			});

			test("should return a ZonedDateTime for a string that appears to have a time zone component", () => {
				const wrapper = mount({ date: "2025-03-29[America/New_York]" });
				const vm = wrapper.vm;

				expect(vm.temporalDate).toBeInstanceOf(Temporal.ZonedDateTime);
			});

			test("should return a PlainDateTime for a string that appears to have a time component", () => {
				const wrapper = mount({ date: "2025-03-29T13:15:20" });
				const vm = wrapper.vm;

				expect(vm.temporalDate).toBeInstanceOf(Temporal.PlainDateTime);
			});

			test("should return a PlainDate for a basic date", () => {
				const wrapper = mount({ date: "2025-03-29" });
				const vm = wrapper.vm;

				expect(vm.temporalDate).toBeInstanceOf(Temporal.PlainDate);
			});

			test("should return a Temporal object unchanged", () => {
				const date = Temporal.PlainDate.from("2025-03-29");
				const wrapper = mount({ date });
				const vm = wrapper.vm;

				expect(vm.temporalDate).toBe(date);
			});

			test("should convert a Temporal instant to a PlainDateTime", () => {
				const wrapper = mount({ date: Temporal.Instant.from("2025-03-29T13:15:20.000Z") });
				const vm = wrapper.vm;

				expect(vm.temporalDate).toBeInstanceOf(Temporal.PlainDateTime);
				expect(vm.temporalDate.toString()).toBe("2025-03-29T13:15:20");
			});

			test("should convert a timestamp to a PlainDateTime", () => {
				const wrapper = mount({ date: 1743254120000 });
				const vm = wrapper.vm;

				expect(vm.temporalDate).toBeInstanceOf(Temporal.PlainDateTime);
				expect(vm.temporalDate.toString()).toBe("2025-03-29T13:15:20");
			});
		});

		describe("displayDate", () => {
			describe("should return null for unsupported values", () => {
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
				])("%s", ([, date]) => {
					const wrapper = mount({ date });
					const vm = wrapper.vm;

					expect(vm.displayDate).toBeNull();
				});
			});

			test("should not throw when format is null", () => {
				const wrapper = mount({ format: null });
				const vm = wrapper.vm;

				expect(vm.displayDate).not.toBeNull();
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

			test("should format a Date instance", () => {
				const wrapper = mount({ date: new Date(2025, 2, 29, 13, 15, 20) });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29/03/2025, 13:15:20");
			});

			test("should format a timestamp", () => {
				const wrapper = mount({ date: 1743254120000 });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29/03/2025, 13:15:20");
			});

			test("should format an ISO instant string", () => {
				const wrapper = mount({ date: "2025-03-29T13:15:20.000Z" });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29/03/2025, 13:15:20");
			});

			test("should format a Temporal date object", () => {
				const wrapper = mount({ date: Temporal.PlainDate.from("2025-03-29") });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29/03/2025");
			});

			test("should format a Temporal instant object", () => {
				const wrapper = mount({ date: Temporal.Instant.from("2025-03-29T13:15:20.000Z") });
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
