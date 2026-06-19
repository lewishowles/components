import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import ContentSeparator from "./content-separator.vue";

// Mount content-separator with sensible defaults for testing.
const mountContentSeparator = createMount(ContentSeparator, { props: { tag: "hr" } });

test.describe("content-separator", () => {
	test("renders a content-separator", async ({ mount, page }) => {
		await mountContentSeparator(mount);

		await expect(page.getByTestId("content-separator")).toBeVisible();
	});

	test("is aria-hidden when not using an hr", async ({ mount, page }) => {
		await mountContentSeparator(mount, { props: { tag: "div" } });

		await expect(page.getByTestId("content-separator")).toHaveAttribute("aria-hidden", "true");
	});

	test("is not aria-hidden when using an hr", async ({ mount, page }) => {
		await mountContentSeparator(mount);

		await expect(page.getByTestId("content-separator")).toHaveAttribute("aria-hidden", "false");
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountContentSeparator(mount);

			await expect(page.getByTestId("content-separator")).toHaveAttribute(
				"data-component",
				"content-separator",
			);
		});
	});
});
