import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import DisplayDate from "./display-date.vue";

// Mount display-date with sensible defaults for testing.
const mountDisplayDate = createMount(DisplayDate, {
	props: { date: "2025-03-29", locale: "en-GB" },
});

test.describe("display-date", () => {
	test("renders a display-date", async ({ mount, page }) => {
		await mountDisplayDate(mount);

		await expect(page.getByTestId("display-date")).toBeVisible();
	});

	test.describe("Formatting", () => {
		test("default formatting is applied", async ({ mount, page }) => {
			await mountDisplayDate(mount);

			await expect(page.getByTestId("display-date")).toHaveText("29/03/2025");
		});

		test("a time-zoned date is formatted", async ({ mount, page }) => {
			await mountDisplayDate(mount, { props: { date: "2025-03-29[America/New_York]" } });

			await expect(page.getByTestId("display-date")).toHaveText("29/03/2025, 0:00:00 GMT-4");
		});

		test("a date with a time component is formatted", async ({ mount, page }) => {
			await mountDisplayDate(mount, { props: { date: "2025-03-29T13:15:20" } });

			await expect(page.getByTestId("display-date")).toHaveText("29/03/2025, 13:15:20");
		});

		test("a custom locale can be provided", async ({ mount, page }) => {
			await mountDisplayDate(mount, { props: { locale: "de-DE" } });

			await expect(page.getByTestId("display-date")).toHaveText("29.3.2025");
		});
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountDisplayDate(mount);

			await expect(page.getByTestId("display-date")).toHaveAttribute(
				"data-component",
				"display-date",
			);
		});
	});
});
