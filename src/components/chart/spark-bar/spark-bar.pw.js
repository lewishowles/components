import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import SparkBar from "./spark-bar.vue";

// Mount spark-bar with sensible defaults for testing.
const mountSparkBar = createMount(SparkBar, { props: { current: 81, max: 100 } });

test.describe("spark-bar", () => {
	test("renders a spark-bar", async ({ mount, page }) => {
		await mountSparkBar(mount);

		await expect(page.getByTestId("spark-bar")).toBeVisible();
	});

	test("the appropriate accessibility attributes are included", async ({ mount, page }) => {
		await mountSparkBar(mount, { props: { min: 20, max: 40, current: 30 } });

		const sparkBar = page.getByTestId("spark-bar");

		await expect(sparkBar).toHaveAttribute("role", "meter");
		await expect(sparkBar).toHaveAttribute("aria-valuenow", "30");
		await expect(sparkBar).toHaveAttribute("aria-valuemin", "20");
		await expect(sparkBar).toHaveAttribute("aria-valuemax", "40");
	});

	test("renders the percentage value by default", async ({ mount, page }) => {
		await mountSparkBar(mount);

		await expect(page.getByTestId("spark-bar-value")).toHaveText("81%");
	});

	test("renders with custom classes", async ({ mount, page }) => {
		await mountSparkBar(mount, {
			props: {
				trackClasses: "h-2 bg-red-200",
				barClasses: "bg-red-800",
				valueClasses: "text-sm font-bold",
			},
		});

		await expect(page.getByTestId("spark-bar")).toBeVisible();
	});
});
