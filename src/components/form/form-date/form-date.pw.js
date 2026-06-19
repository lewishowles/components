import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormDate from "./form-date.vue";

// Mount form-date with sensible defaults for testing.
const mountFormDate = createMount(FormDate, {
	props: { id: "id-abc" },
	slots: { default: "When did you first request help?" },
});

test.describe("form-date", () => {
	test("renders a form-date", async ({ mount, page }) => {
		await mountFormDate(mount);

		const formDate = page.getByTestId("form-date");

		await expect(formDate).toBeVisible();
		await expect(page.getByTestId("form-date-day")).toBeVisible();
		await expect(page.getByTestId("form-date-month")).toBeVisible();
		await expect(page.getByTestId("form-date-year")).toBeVisible();
		await expect(page.getByTestId("form-label")).toHaveCount(4);
	});

	test("a required parameter is passed to the date fields", async ({ mount, page }) => {
		await mountFormDate(mount, { props: { required: true } });

		await expect(page.getByTestId("form-date-day").locator("input")).toHaveAttribute("required");
		await expect(page.getByTestId("form-date-month").locator("input")).toHaveAttribute("required");
		await expect(page.getByTestId("form-date-year").locator("input")).toHaveAttribute("required");
	});

	test("an initial date can be provided in ISO format", async ({ mount, page }) => {
		await mountFormDate(mount, { props: { modelValue: "2025-02-24" } });

		await expect(page.getByTestId("form-date-day").locator("input")).toHaveValue("24");
		await expect(page.getByTestId("form-date-month").locator("input")).toHaveValue("2");
		await expect(page.getByTestId("form-date-year").locator("input")).toHaveValue("2025");
	});

	test.describe("aria-invalid", () => {
		test("is set on the fieldset when an error is provided", async ({ mount, page }) => {
			await mountFormDate(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-date")).toHaveAttribute("aria-invalid", "true");
		});

		test("is not set without an error", async ({ mount, page }) => {
			await mountFormDate(mount);

			await expect(page.getByTestId("form-date")).not.toHaveAttribute("aria-invalid");
		});
	});

	test.describe("Supplementary information", () => {
		test("help can be supplied", async ({ mount, page }) => {
			await mountFormDate(mount, { slots: { help: "Help text" } });

			const helpElement = page.getByTestId("form-help");

			await expect(helpElement).toBeVisible();
			await expect(helpElement).toHaveText("Help text");
			await expect(helpElement).toHaveAttribute("id", "id-abc-help");
		});

		test("an error can be supplied", async ({ mount, page }) => {
			await mountFormDate(mount, { slots: { error: "Error text" } });

			const errorElement = page.getByTestId("form-error");

			await expect(errorElement).toBeVisible();
			await expect(errorElement).toHaveText("Error text");
			await expect(errorElement).toHaveAttribute("id", "id-abc-error");
		});

		test("both help and an error can be supplied", async ({ mount, page }) => {
			await mountFormDate(mount, { slots: { help: "Help text", error: "Error text" } });

			await expect(page.getByTestId("form-help")).toBeVisible();
			await expect(page.getByTestId("form-error")).toBeVisible();
		});
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormDate(mount);

			await expect(page.getByTestId("form-date")).toHaveAttribute("data-component", "form-date");
		});

		test("data-invalid is set when the field has an error", async ({ mount, page }) => {
			await mountFormDate(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-date")).toHaveAttribute("data-invalid", "true");
		});

		test("data-invalid is not set without an error", async ({ mount, page }) => {
			await mountFormDate(mount);

			await expect(page.getByTestId("form-date")).not.toHaveAttribute("data-invalid");
		});
	});
});
