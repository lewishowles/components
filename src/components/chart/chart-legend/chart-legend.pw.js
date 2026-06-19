import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import ChartLegend from "./chart-legend.vue";

const defaultSeries = [
	{ color: "var(--color-chart-1)", label: "Revenue", value: 42 },
	{ color: "var(--color-chart-2)", label: "Costs", value: 18 },
	{ color: "var(--color-chart-3)", label: "Profit", value: 24 },
];

// Mount chart-legend with sensible defaults for testing.
const mountChartLegend = createMount(ChartLegend, { props: { series: defaultSeries } });

test.describe("chart-legend", () => {
	test("renders a chart-legend", async ({ mount, page }) => {
		await mountChartLegend(mount);

		await expect(page.getByTestId("chart-legend")).toBeVisible();
	});

	test("does not render when series is empty", async ({ mount, page }) => {
		await mountChartLegend(mount, { props: { series: [] } });

		await expect(page.getByTestId("chart-legend")).not.toBeAttached();
	});

	test("renders the correct number of entries", async ({ mount, page }) => {
		await mountChartLegend(mount);

		await expect(page.getByTestId("chart-legend-entry")).toHaveCount(3);
	});

	test("renders a label for each entry", async ({ mount, page }) => {
		await mountChartLegend(mount);

		await expect(page.getByTestId("chart-legend-label").first()).toHaveText("Revenue");
	});

	test("renders a value for each entry by default", async ({ mount, page }) => {
		await mountChartLegend(mount);

		await expect(page.getByTestId("chart-legend-value")).toHaveCount(3);
	});

	test("hides values when showValues is false", async ({ mount, page }) => {
		await mountChartLegend(mount, { props: { showValues: false } });

		await expect(page.getByTestId("chart-legend-value")).toHaveCount(0);
	});
});
