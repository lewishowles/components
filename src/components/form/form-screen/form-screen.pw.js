import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormScreenFixture from "./form-screen.fixture.vue";

// Mount the fixture with a stable screen ID and representative content.
const mountFormScreen = createMount(FormScreenFixture);

test.describe("form-screen", () => {
	test("renders a form-screen", async ({ mount, page }) => {
		await mountFormScreen(mount);

		await expect(page.getByTestId("form-screen")).toBeVisible();
	});
});
