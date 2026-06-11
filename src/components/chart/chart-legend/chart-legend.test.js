import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import ChartLegend from "./chart-legend.vue";

const defaultSeries = [
	{ color: "var(--color-chart-1)", label: "Revenue", value: 42 },
	{ color: "var(--color-chart-2)", label: "Costs", value: 18 },
];

const mount = createMount(ChartLegend, { props: { series: defaultSeries } });

describe("chart-legend", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("haveSeries", () => {
			test("Is false when series is empty", () => {
				const wrapper = mount({ series: [] });

				expect(wrapper.vm.haveSeries).toBe(false);
			});

			test("Is false when series is not an array", () => {
				const wrapper = mount({ series: null });

				expect(wrapper.vm.haveSeries).toBe(false);
			});

			test("Is true when series has entries", () => {
				const wrapper = mount();

				expect(wrapper.vm.haveSeries).toBe(true);
			});
		});

		describe("rootClasses", () => {
			test("Applies row layout for horizontal orientation", () => {
				const wrapper = mount({ orientation: "horizontal" });

				expect(wrapper.vm.rootClasses).toContain("flex-row");
				expect(wrapper.vm.rootClasses).not.toContain("flex-col");
			});

			test("Applies column layout for vertical orientation", () => {
				const wrapper = mount({ orientation: "vertical" });

				expect(wrapper.vm.rootClasses).toContain("flex-col");
				expect(wrapper.vm.rootClasses).not.toContain("flex-row");
			});

			test("Defaults to vertical layout", () => {
				const wrapper = mount();

				expect(wrapper.vm.rootClasses).toContain("flex-col");
			});

			test("Merges provided classes onto the root element", () => {
				const wrapper = mount({ attrs: { class: "custom-class" } });

				expect(wrapper.vm.rootClasses).toContain("custom-class");
			});
		});
	});

	describe("Methods", () => {
		describe("formattedValue", () => {
			test("Returns the raw value when no formatValue prop is provided", () => {
				const wrapper = mount();

				expect(wrapper.vm.formattedValue(42)).toBe(42);
			});

			test("Applies the formatValue callback when provided", () => {
				const wrapper = mount({ formatValue: (value) => `£${value}` });

				expect(wrapper.vm.formattedValue(42)).toBe("£42");
			});

			test("Passes the value as-is when formatValue is not a function", () => {
				const wrapper = mount({ formatValue: "not-a-function" });

				expect(wrapper.vm.formattedValue(42)).toBe(42);
			});
		});
	});
});
