import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormComboBox from "./form-combo-box.vue";

// Mount form-combo-box with sensible defaults for testing.
const mountFormComboBox = createMount(FormComboBox);

test.describe("form-combo-box", () => {
	test("renders a form-combo-box", async ({ mount, page }) => {
		await mountFormComboBox(mount);

		await expect(page.getByTestId("form-combo-box")).toBeVisible();
	});
});
