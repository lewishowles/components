import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import DonutChart from "./donut-chart.vue";

const defaultProps = { values: [50, 25, 25] };
const mount = createMount(DonutChart, { props: defaultProps });

describe("donut-chart", () => {
	console.warn = vi.fn();

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("total", () => {
			test("should calculate an appropriate total", () => {
				const wrapper = mount();

				expect(wrapper.vm.total).toBe(100);
			});

			describe("should disregard non-array values", () => {
				test.for([
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, values]) => {
					const wrapper = mount({ values });

					expect(wrapper.vm.total).toBe(0);
				});
			});

			test("should disregard values if a non-number is found", () => {
				const wrapper = mount({ values: [5, 4, 3, "a"] });

				expect(wrapper.vm.total).toBe(0);
			});

			test("should disregard negative numbers", () => {
				const wrapper = mount({ values: [5, 4, 3, -1] });

				expect(wrapper.vm.total).toBe(0);
			});
		});

		describe("slices", () => {
			test("should generate the appropriate slices", () => {
				const wrapper = mount();

				expect(wrapper.vm.slices).toEqual([
					{
						commands: expect.any(String),
						id: expect.any(String),
						rotation: 0,
					},
					{
						commands: expect.any(String),
						id: expect.any(String),
						rotation: 180,
					},
					{
						commands: expect.any(String),
						id: expect.any(String),
						rotation: 270,
					},
				]);
			});

			describe("should disregard non-array values", () => {
				test.for([
					["number (positive)", 1],
					["number (negative)", -1],
					["number (NaN)", NaN],
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["null", null],
					["undefined", undefined],
				])("%s", ([, values]) => {
					const wrapper = mount({ values });

					expect(wrapper.vm.slices).toEqual([]);
				});
			});

			test("should disregard values if a non-number is found", () => {
				const wrapper = mount({ values: [5, 4, 3, "a"] });

				expect(wrapper.vm.slices).toEqual([]);
			});

			test("should disregard negative numbers", () => {
				const wrapper = mount({ values: [5, 4, 3, -1] });

				expect(wrapper.vm.slices).toEqual([]);
			});
		});
	});

	describe("Methods", () => {
		describe("getCircleCoordinateForAngle", () => {
			describe("should return zeros for non-number angle", () => {
				test.for([
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, angle]) => {
					const wrapper = mount();

					expect(wrapper.vm.getCircleCoordinateForAngle(angle, 50)).toBe("0 0");
				});
			});

			describe("should return zeros for non-number radius", () => {
				test.for([
					["string (non-empty)", "string"],
					["string (empty)", ""],
					["object (non-empty)", { property: "value" }],
					["object (empty)", {}],
					["array (non-empty)", [1, 2, 3]],
					["array (empty)", []],
					["null", null],
					["undefined", undefined],
				])("%s", ([, radius]) => {
					const wrapper = mount();

					expect(wrapper.vm.getCircleCoordinateForAngle(90, radius)).toBe("0 0");
				});
			});

			test("should generate the appropriate position", () => {
				const wrapper = mount();

				expect(wrapper.vm.getCircleCoordinateForAngle(90, 50)).toBe("100 50");
				expect(wrapper.vm.getCircleCoordinateForAngle(90, 30)).toBe("80 50");
				expect(wrapper.vm.getCircleCoordinateForAngle(180, 20)).toBe("50 70");
			});
		});
	});
});
