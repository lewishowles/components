import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormInputGroup from "./form-input-group.vue";

// Mount form-input-group with sensible defaults for testing.
const mountFormInputGroup = createMount(FormInputGroup, {
	props: { type: "radio", options: ["Yes", "No"] },
});

test.describe("form-input-group", () => {
	test("a form input group is rendered", async ({ mount, page }) => {
		await mountFormInputGroup(mount);

		await expect(page.getByTestId("form-input-group")).toBeVisible();
	});

	test.describe("aria-invalid", () => {
		test("is set on the fieldset when an error is provided", async ({ mount, page }) => {
			await mountFormInputGroup(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-input-group")).toHaveAttribute("aria-invalid", "true");
		});

		test("is not set without an error", async ({ mount, page }) => {
			await mountFormInputGroup(mount);

			await expect(page.getByTestId("form-input-group")).not.toHaveAttribute("aria-invalid");
		});
	});

	test.describe("required", () => {
		test("sets aria-required on the fieldset when required", async ({ mount, page }) => {
			await mountFormInputGroup(mount, { required: true });

			await expect(page.getByTestId("form-input-group")).toHaveAttribute("aria-required", "true");
		});

		test("does not set aria-required when not required", async ({ mount, page }) => {
			await mountFormInputGroup(mount);

			await expect(page.getByTestId("form-input-group")).not.toHaveAttribute("aria-required");
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormInputGroup(mount);

			await expect(page.getByTestId("form-input-group")).toHaveAttribute(
				"data-component",
				"form-input-group",
			);
		});

		test("data-invalid is set when the field has an error", async ({ mount, page }) => {
			await mountFormInputGroup(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-input-group")).toHaveAttribute("data-invalid");
		});

		test("data-invalid is not set without an error", async ({ mount, page }) => {
			await mountFormInputGroup(mount);

			await expect(page.getByTestId("form-input-group")).not.toHaveAttribute("data-invalid");
		});
	});
});
