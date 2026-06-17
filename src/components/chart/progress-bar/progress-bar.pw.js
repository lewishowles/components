import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import ProgressBar from "./progress-bar.vue";

// Mount progress-bar with sensible defaults for testing.
const mountProgressBar = createMount(ProgressBar, {
	props: { current: 30 },
	slots: { default: "Progress bar" },
});

test.describe("progress-bar", () => {
	test("renders a progress-bar", async ({ mount, page }) => {
		await mountProgressBar(mount);

		const progressBar = page.getByTestId("progress-bar");

		await expect(progressBar).toBeVisible();
		await expect(progressBar).toHaveAttribute("aria-labelledby");
		await expect(page.getByTestId("progress-bar-label")).toHaveClass(/sr-only/);
	});

	test("the appropriate accessibility attributes are included", async ({ mount, page }) => {
		await mountProgressBar(mount, { props: { min: 10, max: 90, current: 28 } });

		const progressBar = page.getByTestId("progress-bar");

		await expect(progressBar).toHaveAttribute("role", "progressbar");
		await expect(progressBar).toHaveAttribute("aria-valuenow", "28");
		await expect(progressBar).toHaveAttribute("aria-valuemin", "10");
		await expect(progressBar).toHaveAttribute("aria-valuemax", "90");
		await expect(progressBar).toHaveAttribute("aria-valuetext", "23%");
		await expect(progressBar).toHaveAttribute("aria-labelledby");
	});

	test("a label can be shown", async ({ mount, page }) => {
		await mountProgressBar(mount, { props: { showLabel: true } });

		await expect(page.getByTestId("progress-bar-label")).toBeVisible();
	});

	test("the value can be shown", async ({ mount, page }) => {
		await mountProgressBar(mount, { props: { showValue: true } });

		await expect(page.getByTestId("progress-bar-value")).toBeVisible();
	});
});
