import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormFieldset from "./form-fieldset.vue";

// Mount form-fieldset with sensible defaults for testing.
const mountFormFieldset = createMount(FormFieldset, { slots: { default: "Fieldset content" } });

test.describe("form-fieldset", () => {
	test("renders a form-fieldset", async ({ mount, page }) => {
		await mountFormFieldset(mount);

		await expect(page.getByTestId("form-fieldset")).toBeVisible();
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormFieldset(mount);

			await expect(page.getByTestId("form-fieldset")).toHaveAttribute(
				"data-component",
				"form-fieldset",
			);
		});
	});
});
