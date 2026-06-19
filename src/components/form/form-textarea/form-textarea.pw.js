import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount } from "@lewishowles/testing/playwright";

import FormTextarea from "./form-textarea.vue";

// Mount form-textarea with sensible defaults for testing.
const mountFormTextarea = createMount(FormTextarea, {
	props: { id: "id-abc" },
	slots: { default: "Your name" },
});

test.describe("form-textarea", () => {
	test("a textarea is rendered", async ({ mount, page }) => {
		await mountFormTextarea(mount);

		const formTextarea = page.getByTestId("form-textarea");

		await expect(formTextarea).toBeVisible();

		const textareaElement = formTextarea.locator("textarea");
		const labelElement = formTextarea.getByTestId("form-label");

		await expect(textareaElement).toHaveAttribute("id", "id-abc");
		await expect(labelElement).toHaveText("Your name");
		await expect(labelElement).toHaveAttribute("for", "id-abc");
	});

	test("additional attributes can be provided to the textarea", async ({ mount, page }) => {
		await mountFormTextarea(mount, { inputAttributes: { autocomplete: "given-name" } });

		await expect(page.getByTestId("form-textarea").locator("textarea")).toHaveAttribute(
			"autocomplete",
			"given-name",
		);
	});

	test.describe("aria-invalid", () => {
		test("is set when an error is provided", async ({ mount, page }) => {
			await mountFormTextarea(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-textarea").locator("textarea")).toHaveAttribute(
				"aria-invalid",
				"true",
			);
		});

		test("is not set without an error", async ({ mount, page }) => {
			await mountFormTextarea(mount);

			await expect(page.getByTestId("form-textarea").locator("textarea")).not.toHaveAttribute(
				"aria-invalid",
			);
		});
	});

	test.describe("supplementary information", () => {
		testSupplementaryInfo(mountFormTextarea, {
			ariaTarget: (page) => page.getByTestId("form-textarea").locator("textarea"),
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormTextarea(mount);

			await expect(page.getByTestId("form-textarea")).toHaveAttribute(
				"data-component",
				"form-textarea",
			);
		});

		test("data-invalid is set when the field has an error", async ({ mount, page }) => {
			await mountFormTextarea(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-textarea")).toHaveAttribute("data-invalid");
		});

		test("data-invalid is not set without an error", async ({ mount, page }) => {
			await mountFormTextarea(mount);

			await expect(page.getByTestId("form-textarea")).not.toHaveAttribute("data-invalid");
		});
	});
});
