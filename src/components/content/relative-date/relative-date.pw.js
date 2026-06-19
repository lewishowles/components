import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import RelativeDate from "./relative-date.vue";

// Mount relative-date with sensible defaults for testing.
const mountRelativeDate = createMount(RelativeDate, {
	props: {
		date: "2025-03-29T13:14:50",
		locale: "en-GB",
		relativeTo: "2025-03-29T13:15:20",
	},
});

test.describe("relative-date", () => {
	test("renders a relative-date", async ({ mount, page }) => {
		await mountRelativeDate(mount);

		await expect(page.getByTestId("relative-date")).toBeVisible();
	});

	test("a relative date is displayed", async ({ mount, page }) => {
		await mountRelativeDate(mount);

		await expect(page.getByTestId("relative-date")).toHaveText("30 seconds ago");
	});

	test("a machine-readable datetime is provided", async ({ mount, page }) => {
		await mountRelativeDate(mount);

		await expect(page.getByTestId("relative-date")).toHaveAttribute("datetime");
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountRelativeDate(mount);

			await expect(page.getByTestId("relative-date")).toHaveAttribute(
				"data-component",
				"relative-date",
			);
		});
	});
});
