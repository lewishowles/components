import { describe, expect, test } from "vite-plus/test";
import { ref } from "vue";
import { useChartConfig } from "./use-chart-config.js";

const segments = [
	{ label: "Revenue", value: 42 },
	{ label: "Costs", value: 18 },
	{ label: "Profit", value: 24 },
];

describe("use-chart-config", () => {
	describe("series", () => {
		test("Returns an empty array when no segments are provided", () => {
			const { series } = useChartConfig([]);

			expect(series.value).toEqual([]);
		});

		test("Returns an empty array when segments is undefined", () => {
			const { series } = useChartConfig(undefined);

			expect(series.value).toEqual([]);
		});

		test("Adds a colour to each segment", () => {
			const { series } = useChartConfig(segments);

			for (const entry of series.value) {
				expect(entry.color).toMatch(/^var\(--color-chart-\d+\)$/);
			}
		});

		test("Preserves label and value from the original segment", () => {
			const { series } = useChartConfig(segments);

			expect(series.value[0].label).toBe("Revenue");
			expect(series.value[0].value).toBe(42);
		});

		test("Assigns a different colour to each segment", () => {
			const { series } = useChartConfig(segments);

			const colours = series.value.map((entry) => entry.color);

			expect(new Set(colours).size).toBe(colours.length);
		});

		test("Reacts to a ref updating", () => {
			const segmentsRef = ref([{ label: "A", value: 1 }]);
			const { series } = useChartConfig(segmentsRef);

			expect(series.value).toHaveLength(1);

			segmentsRef.value = [
				{ label: "A", value: 1 },
				{ label: "B", value: 2 },
			];

			expect(series.value).toHaveLength(2);
		});
	});

	describe("getColor", () => {
		test("Returns the expected CSS variable for the first index", () => {
			const { getColor } = useChartConfig(segments);

			expect(getColor(0)).toBe("var(--color-chart-1)");
		});

		test("Returns the expected CSS variable for a mid-range index", () => {
			const { getColor } = useChartConfig(segments);

			expect(getColor(4)).toBe("var(--color-chart-5)");
		});

		test("Wraps back to 1 after the palette is exhausted", () => {
			const { getColor } = useChartConfig(segments);

			expect(getColor(8)).toBe("var(--color-chart-1)");
		});

		test("Wraps correctly at arbitrary multiples of the palette size", () => {
			const { getColor } = useChartConfig(segments);

			expect(getColor(16)).toBe("var(--color-chart-1)");
			expect(getColor(9)).toBe("var(--color-chart-2)");
		});
	});
});
