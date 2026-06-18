import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import DonutChart from "./donut-chart.vue";

const defaultProps = {
	segments: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }],
	class: "size-40",
};

// Mount donut-chart with sensible defaults for testing.
const mountDonutChart = createMount(DonutChart, { props: defaultProps });

test.describe("donut-chart", () => {
	test("a chart is rendered", async ({ mount, page }) => {
		await mountDonutChart(mount);

		await expect(page.getByTestId("donut-chart")).toBeVisible();
	});

	test("the correct number of segments appear", async ({ mount, page }) => {
		await mountDonutChart(mount, {
			props: {
				segments: [{ value: 5 }, { value: 4 }, { value: 3 }, { value: 2 }, { value: 1 }],
			},
		});

		await expect(page.getByTestId("donut-chart-segment")).toHaveCount(5);
	});
});
