import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount } from "@lewishowles/testing/playwright";

import FormCheckbox from "./form-checkbox.vue";

// Mount form-checkbox with sensible defaults for testing.
const mountFormCheckbox = createMount(FormCheckbox, {
	props: { id: "id-abc" },
	slots: { default: "Your name" },
});

test.describe("form-checkbox", () => {
	test("a checkbox is rendered", async ({ mount, page }) => {
		await mountFormCheckbox(mount);

		const formCheckbox = page.getByTestId("form-checkbox");

		await expect(formCheckbox).toBeVisible();
		await expect(page.getByTestId("form-label-no-label")).not.toBeAttached();

		const inputElement = formCheckbox.locator("input");
		const labelElement = formCheckbox.getByTestId("form-label");

		await expect(inputElement).toHaveAttribute("id", "id-abc");
		await expect(inputElement).toHaveAttribute("type", "checkbox");
		await expect(labelElement).toHaveText("Your name(optional)");
		await expect(labelElement).toHaveAttribute("for", "id-abc");
	});

	test.describe("label", () => {
		test("a label is required", async ({ mount, page }) => {
			await mountFormCheckbox(mount, { slots: { default: "" } });

			await expect(page.getByTestId("form-label-no-label")).toBeVisible();
		});

		test("a label can be hidden", async ({ mount, page }) => {
			await mountFormCheckbox(mount, { displayLabel: false });

			await expect(page.getByTestId("form-label")).toHaveClass(/sr-only/);
		});
	});

	test("additional attributes can be provided to the input", async ({ mount, page }) => {
		await mountFormCheckbox(mount, { inputAttributes: { required: true } });

		await expect(page.getByTestId("form-checkbox").locator("input")).toHaveAttribute("required");
	});

	test.describe("aria-invalid", () => {
		test("is set when an error is provided", async ({ mount, page }) => {
			await mountFormCheckbox(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-checkbox").locator("input")).toHaveAttribute(
				"aria-invalid",
				"true",
			);
		});

		test("is not set without an error", async ({ mount, page }) => {
			await mountFormCheckbox(mount);

			await expect(page.getByTestId("form-checkbox").locator("input")).not.toHaveAttribute(
				"aria-invalid",
			);
		});
	});

	test.describe("supplementary information", () => {
		testSupplementaryInfo(mountFormCheckbox, {
			ariaTarget: (page) => page.getByTestId("form-checkbox").locator("input"),
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormCheckbox(mount);

			await expect(page.getByTestId("form-checkbox")).toHaveAttribute(
				"data-component",
				"form-checkbox",
			);
		});

		test("data-checked is set when the checkbox is checked", async ({ mount, page }) => {
			await mountFormCheckbox(mount, { modelValue: true });

			await expect(page.getByTestId("form-checkbox")).toHaveAttribute("data-checked");
		});

		test("data-checked is not set when unchecked", async ({ mount, page }) => {
			await mountFormCheckbox(mount, { modelValue: false });

			await expect(page.getByTestId("form-checkbox")).not.toHaveAttribute("data-checked");
		});

		test("data-indeterminate is set when indeterminate", async ({ mount, page }) => {
			await mountFormCheckbox(mount, { indeterminate: true });

			await expect(page.getByTestId("form-checkbox")).toHaveAttribute("data-indeterminate");
		});

		test("data-invalid is set when the field has an error", async ({ mount, page }) => {
			await mountFormCheckbox(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-checkbox")).toHaveAttribute("data-invalid");
		});

		test("data-invalid is not set without an error", async ({ mount, page }) => {
			await mountFormCheckbox(mount);

			await expect(page.getByTestId("form-checkbox")).not.toHaveAttribute("data-invalid");
		});
	});
});
