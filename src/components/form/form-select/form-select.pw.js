import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import FormSelect from "./form-select.vue";

// Mount form-select with sensible defaults for testing.
const mountFormSelect = createMount(FormSelect);

test.describe("form-select", () => {
	test("renders a form-select", async ({ mount, page }) => {
		await mountFormSelect(mount);

		await expect(page.getByTestId("form-select")).toBeVisible();
	});

	test.describe("aria-invalid", () => {
		test("is set when an error is provided", async ({ mount, page }) => {
			await mountFormSelect(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-select").locator("select")).toHaveAttribute(
				"aria-invalid",
				"true",
			);
		});

		test("is not set without an error", async ({ mount, page }) => {
			await mountFormSelect(mount);

			await expect(page.getByTestId("form-select").locator("select")).not.toHaveAttribute(
				"aria-invalid",
			);
		});
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormSelect(mount);

			await expect(page.getByTestId("form-select")).toHaveAttribute(
				"data-component",
				"form-select",
			);
		});

		test("data-invalid is set when the field has an error", async ({ mount, page }) => {
			await mountFormSelect(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-select")).toHaveAttribute("data-invalid", "true");
		});

		test("data-invalid is not set without an error", async ({ mount, page }) => {
			await mountFormSelect(mount);

			await expect(page.getByTestId("form-select")).not.toHaveAttribute("data-invalid");
		});
	});
});
