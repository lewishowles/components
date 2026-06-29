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

	test.describe("titleClasses", () => {
		test("merges user-provided titleClasses with defaults", async ({ mount, page }) => {
			await mountFormFieldset(mount, {
				props: { titleClasses: "text-4xl text-blue-500" },
				slots: { title: "Section title" },
			});

			const heading = page.getByTestId("form-fieldset").locator("h2");

			await expect(heading).toHaveClass(/text-4xl/);
			await expect(heading).toHaveClass(/text-blue-500/);
			await expect(heading).not.toHaveClass(/text-3xl/);
		});
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
