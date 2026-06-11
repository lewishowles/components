import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vite-plus/test";
import DonutChart from "./donut-chart.vue";

const defaultSegments = [
	{ label: "A", value: 50 },
	{ label: "B", value: 25 },
	{ label: "C", value: 25 },
];

const defaultProps = { segments: defaultSegments };
const defaultSlots = { label: "Sales by region" };
const mount = createMount(DonutChart, { props: defaultProps, slots: defaultSlots });

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

			describe("should disregard non-array segments", () => {
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
				])("%s", ([, segments]) => {
					const wrapper = mount({ segments });

					expect(wrapper.vm.total).toBe(0);
				});
			});

			test("should disregard segments if a non-number value is found", () => {
				const wrapper = mount({
					segments: [{ value: 5 }, { value: 4 }, { value: 3 }, { value: "a" }],
				});

				expect(wrapper.vm.total).toBe(0);
			});

			test("should disregard negative numbers", () => {
				const wrapper = mount({
					segments: [{ value: 5 }, { value: 4 }, { value: 3 }, { value: -1 }],
				});

				expect(wrapper.vm.total).toBe(0);
			});
		});

		describe("haveLabel", () => {
			test("Is false when no label slot is provided", () => {
				const wrapper = mount({ slots: { label: null } });

				expect(wrapper.vm.haveLabel).toBe(false);
			});

			test("Is true when a label slot is provided", () => {
				const wrapper = mount();

				expect(wrapper.vm.haveLabel).toBe(true);
			});
		});

		describe("haveDescription", () => {
			test("Is false when no description slot is provided", () => {
				const wrapper = mount();

				expect(wrapper.vm.haveDescription).toBe(false);
			});

			test("Is true when a description slot is provided", () => {
				const wrapper = mount({
					slots: {
						description: "Breakdown of sales by region for Q1.",
					},
				});

				expect(wrapper.vm.haveDescription).toBe(true);
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

			describe("should disregard non-array segments", () => {
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
				])("%s", ([, segments]) => {
					const wrapper = mount({ segments });

					expect(wrapper.vm.slices).toEqual([]);
				});
			});

			test("should disregard segments if a non-number value is found", () => {
				const wrapper = mount({
					segments: [{ value: 5 }, { value: 4 }, { value: 3 }, { value: "a" }],
				});

				expect(wrapper.vm.slices).toEqual([]);
			});

			test("should disregard negative numbers", () => {
				const wrapper = mount({
					segments: [{ value: 5 }, { value: 4 }, { value: 3 }, { value: -1 }],
				});

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
