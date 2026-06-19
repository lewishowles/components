import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";

import StarRating from "./star-rating.vue";

// Mount star-rating with sensible defaults for testing.
const mountStarRating = createMount(StarRating, {
	props: { id: "id-abc" },
	slots: { default: "Rate your experience" },
});

test.describe("star-rating", () => {
	test("renders a star-rating", async ({ mount, page }) => {
		await mountStarRating(mount);

		const starRating = page.getByTestId("star-rating");
		const labels = page.getByTestId("form-label");

		await expect(starRating).toBeVisible();
		await expect(labels).toHaveCount(6);
		await expect(labels.nth(0)).toHaveText("Rate your experience");
		await expect(labels.nth(1)).toContainText("1");
		await expect(labels.nth(2)).toContainText("2");
		await expect(labels.nth(3)).toContainText("3");
		await expect(labels.nth(4)).toContainText("4");
		await expect(labels.nth(5)).toContainText("5");
		await expect(page.getByTestId("star-rating-current-rating")).not.toBeAttached();
		await expect(page.getByTestId("form-input-group-introduction")).not.toBeAttached();
		await expect(page.getByTestId("form-help")).not.toBeAttached();
		await expect(page.getByTestId("form-error")).not.toBeAttached();
	});

	test.describe("Display", () => {
		test("read-only mode can be activated", async ({ mount, page }) => {
			await mountStarRating(mount, { props: { readOnly: true } });

			await expect(page.getByTestId("form-label")).toHaveCount(1);
		});
	});

	test.describe("Supplementary information", () => {
		test("an introduction can be supplied", async ({ mount, page }) => {
			await mountStarRating(mount, { slots: { introduction: "Introductory text" } });

			const introduction = page.getByTestId("form-input-group-introduction");

			await expect(introduction).toBeVisible();
			await expect(introduction).toHaveText("Introductory text");
		});

		test("a current rating can be provided", async ({ mount, page }) => {
			await mountStarRating(mount, { slots: { "current-rating": "4.5/5 based on 600 reviews" } });

			const currentRating = page.getByTestId("star-rating-current-rating");

			await expect(currentRating).toBeVisible();
			await expect(currentRating).toHaveText("4.5/5 based on 600 reviews");
		});

		testSupplementaryInfo(mountStarRating, {
			ariaTarget: (page) => page.getByTestId("star-rating"),
		});
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountStarRating(mount);

			await expect(page.getByTestId("star-rating")).toHaveAttribute(
				"data-component",
				"star-rating",
			);
		});

		test("data-part is set on the options wrapper", async ({ mount, page }) => {
			await mountStarRating(mount);

			await expect(page.getByTestId("star-rating").locator("[data-part='options']")).toBeAttached();
		});

		test("data-part is set on each option", async ({ mount, page }) => {
			await mountStarRating(mount);

			await expect(page.getByTestId("star-rating").locator("[data-part='option']")).toHaveCount(5);
		});

		test("data-readonly is set in read-only mode", async ({ mount, page }) => {
			await mountStarRating(mount, { props: { readOnly: true } });

			await expect(page.getByTestId("star-rating")).toHaveAttribute("data-readonly", "true");
		});

		test("data-readonly is not set in interactive mode", async ({ mount, page }) => {
			await mountStarRating(mount);

			await expect(page.getByTestId("star-rating")).not.toHaveAttribute("data-readonly");
		});
	});
});
