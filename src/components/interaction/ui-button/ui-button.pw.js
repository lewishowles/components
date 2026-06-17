import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import UiButton from "./ui-button.vue";

// Mount ui-button with sensible defaults for testing.
const mountUiButton = createMount(UiButton, { slots: { default: "Click me" } });

test.describe("ui-button", () => {
	test("renders a ui-button", async ({ mount, page }) => {
		await mountUiButton(mount);

		await expect(page.getByTestId("ui-button")).toBeVisible();
	});
});
