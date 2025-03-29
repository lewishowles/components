import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import DisplayDate from "./display-date.vue";

const mount = createMount(DisplayDate);

describe("display-date", () => {
	console.warn = vi.fn();
	console.error = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
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
				const wrapper = mount({ date: "2025-03-29" });
				const vm = wrapper.vm;

				expect(vm.displayDate).toBe("29/03/2025");
			});
		});
	});
});
