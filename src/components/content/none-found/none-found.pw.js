import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import NoneFound from "./none-found.vue";

// Mount none-found with sensible defaults for testing.
const mountNoneFound = createMount(NoneFound, {
	slots: {
		title: "No users found",
		default: "No users were added in the last 7 days.",
	},
});

test.describe("none-found", () => {
	test("renders a none-found", async ({ mount, page }) => {
		await mountNoneFound(mount);

		await expect(page.getByTestId("none-found")).toBeVisible();
		await expect(page.getByTestId("none-found-title")).toBeVisible();
	});

	test.describe("Render", () => {
		test.describe("Actions", () => {
			test("actions are not visible by default", async ({ mount, page }) => {
				await mountNoneFound(mount);

				await expect(page.getByTestId("none-found-actions")).not.toBeAttached();
			});

			test("actions are visible when provided", async ({ mount, page }) => {
				await mountNoneFound(mount, { slots: { actions: "Actions" } });

				await expect(page.getByTestId("none-found-actions")).toBeVisible();
			});
		});
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountNoneFound(mount);

			await expect(page.getByTestId("none-found")).toHaveAttribute("data-component", "none-found");
		});
	});
});
