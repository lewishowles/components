import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import ContentCardFixture from "./content-card.fixture.vue";

// Mount the fixture so child components (section, header, footer) can be composed in slots.
const mountContentCard = createMount(ContentCardFixture);

test.describe("content-card", () => {
	test("card content is rendered", async ({ mount, page }) => {
		await mountContentCard(mount);

		await expect(page.getByTestId("content-card")).toBeVisible();
		await expect(page.getByTestId("content-card-section")).toHaveText("Card content");
	});

	test("header content is rendered", async ({ mount, page }) => {
		await mountContentCard(mount, { scenario: "with-header" });

		await expect(page.getByTestId("content-card-header")).toBeVisible();
		await expect(page.getByTestId("content-card-title")).toHaveText("Card title");

		await expect(
			page.getByTestId("content-card-icon").locator('[data-test="card-example-icon"]'),
		).toBeVisible();

		await expect(page.getByTestId("content-card-header-additional")).toHaveText("Card actions");
	});

	test("heading level is configurable", async ({ mount, page }) => {
		await mountContentCard(mount, { scenario: "heading-h3" });

		const titleElement = page.getByTestId("content-card-title");
		const tagName = await titleElement.evaluate((el) => el.tagName.toLowerCase());

		expect(tagName).toBe("h3");
	});

	test("multiple sections stack with collapsed borders", async ({ mount, page }) => {
		await mountContentCard(mount, { scenario: "multiple-sections" });

		await expect(page.getByTestId("content-card-section")).toHaveCount(2);
	});

	test("custom title content replaces the default header layout", async ({ mount, page }) => {
		await mountContentCard(mount, { scenario: "custom-header" });

		await expect(
			page.getByTestId("content-card-header").locator('[data-test="custom-card-header"]'),
		).toHaveText("Custom header");
		await expect(page.getByTestId("content-card-title")).not.toBeAttached();
	});

	test("footer content is rendered", async ({ mount, page }) => {
		await mountContentCard(mount, { scenario: "with-footer" });

		await expect(page.getByTestId("content-card-footer")).toHaveText("Card footer");
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountContentCard(mount);

			await expect(page.getByTestId("content-card")).toHaveAttribute(
				"data-component",
				"content-card",
			);
		});
	});
});
