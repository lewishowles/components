import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import UiButton from "./ui-button.vue";

// Mount ui-button with sensible defaults for testing.
const mountUiButton = createMount(UiButton, { slots: { default: "Click me" } });

test.describe("ui-button", () => {
	test("renders a ui-button", async ({ mount, page }) => {
		await mountUiButton(mount);

		const button = page.getByTestId("ui-button");

		await expect(button).toBeVisible();
		await expect(button).toHaveAttribute("data-component", "ui-button");
	});

	test("uses caller-provided component and test hooks", async ({ mount, page }) => {
		await mountUiButton(mount, {
			props: {
				"data-component": "custom-ui-button",
				"data-test": "custom-ui-button",
			},
		});

		const button = page.getByTestId("custom-ui-button");

		await expect(button).toBeVisible();
		await expect(button).toHaveAttribute("data-component", "custom-ui-button");
		await expect(page.getByTestId("ui-button")).not.toBeAttached();
	});

	test("renders icon-only variants as square touch targets", async ({ mount, page }) => {
		await mountUiButton(mount, {
			class: "button--ghost",
			iconOnly: true,
			iconStart: "icon-cross",
		});

		const button = page.getByTestId("ui-button");
		const bounds = await button.boundingBox();

		expect(bounds?.width).toBe(bounds?.height);
		expect(bounds?.width).toBeGreaterThanOrEqual(36);
	});
});
