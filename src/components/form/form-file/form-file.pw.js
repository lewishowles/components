import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount } from "@lewishowles/testing/playwright";

import FormFileScopedSlotFixture from "./form-file-scoped-slot.fixture.vue";
import FormFile from "./form-file.vue";

// Mount form-file with sensible defaults for testing.
const mountFormFile = createMount(FormFile, {
	props: { id: "id-abc" },
	slots: { default: "Supporting document" },
});

const mountFormFileScopedSlot = createMount(FormFileScopedSlotFixture);

const testFile = {
	name: "document.pdf",
	mimeType: "application/pdf",
	buffer: Buffer.from("content"),
};

const secondTestFile = {
	name: "terms.pdf",
	mimeType: "application/pdf",
	buffer: Buffer.from("content"),
};

test.describe("form-file", () => {
	test("a file input is rendered", async ({ mount, page }) => {
		await mountFormFile(mount);

		const formFile = page.getByTestId("form-file");

		await expect(formFile).toBeVisible();

		const inputElement = formFile.locator('input[type="file"]');

		await expect(inputElement).toHaveAttribute("id", "id-abc");

		const labelElement = formFile.getByTestId("form-label");

		await expect(labelElement).toHaveText("Supporting document");
		await expect(labelElement).toHaveAttribute("for", "id-abc");

		await expect(page.getByTestId("form-file").locator('[data-part="remove"]')).not.toBeAttached();
	});

	test("additional attributes can be provided to the input", async ({ mount, page }) => {
		await mountFormFile(mount, { inputAttributes: { accept: ".pdf" } });

		await expect(page.getByTestId("form-file").locator('input[type="file"]')).toHaveAttribute(
			"accept",
			".pdf",
		);
	});

	test("keeps generated input attributes authoritative", async ({ mount, page }) => {
		await mountFormFile(mount, {
			props: {
				inputAttributes: {
					id: "custom-id",
					type: "text",
					multiple: true,
					required: true,
					"aria-describedby": "custom-help",
					"aria-errormessage": "custom-error",
					"aria-invalid": "false",
				},
			},
			slots: { help: "Help text" },
		});

		const inputElement = page.getByTestId("form-file").locator("input");

		await expect(inputElement).toHaveAttribute("id", "id-abc");
		await expect(inputElement).toHaveAttribute("type", "file");
		await expect(inputElement).not.toHaveAttribute("multiple");
		await expect(inputElement).not.toHaveAttribute("required");
		await expect(inputElement).toHaveAttribute("aria-describedby", "id-abc-help custom-help");
		await expect(inputElement).not.toHaveAttribute("aria-errormessage");
		await expect(inputElement).not.toHaveAttribute("aria-invalid");
	});

	test.describe("file selection", () => {
		test("supports selecting multiple files", async ({ mount, page }) => {
			await mountFormFile(mount, { multiple: true });

			const formFile = page.getByTestId("form-file");
			const inputElement = formFile.locator('input[type="file"]');

			await expect(inputElement).toHaveAttribute("multiple");

			await inputElement.setInputFiles([testFile, secondTestFile]);

			await expect(formFile.locator('[data-part="remove"]')).toContainText("Remove 2 files");
		});

		test("selecting a file shows a remove button naming the file", async ({ mount, page }) => {
			await mountFormFile(mount);

			await page.getByTestId("form-file").locator('input[type="file"]').setInputFiles(testFile);

			const removeButton = page.getByTestId("form-file").locator('[data-part="remove"]');

			await expect(removeButton).toBeVisible();
			await expect(removeButton).toContainText("document.pdf");
		});

		test("one file in multiple mode is named in the remove button", async ({ mount, page }) => {
			await mountFormFile(mount, { multiple: true });

			const formFile = page.getByTestId("form-file");

			await formFile.locator('input[type="file"]').setInputFiles(testFile);

			await expect(formFile.locator('[data-part="remove"]')).toContainText("document.pdf");
		});

		test("the remove button label slot receives the selected files", async ({ mount, page }) => {
			await mountFormFileScopedSlot(mount);

			const formFile = page.getByTestId("form-file");

			await formFile.locator('input[type="file"]').setInputFiles([testFile, secondTestFile]);

			await expect(formFile.locator('[data-part="remove"]')).toContainText("Clear 2 files");
		});

		test("places the remove button below the file input", async ({ mount, page }) => {
			await mountFormFile(mount);

			const formFile = page.getByTestId("form-file");
			const inputElement = formFile.locator('input[type="file"]');

			await inputElement.setInputFiles(testFile);

			const removeButton = formFile.locator('[data-part="remove"]');
			const inputBox = await inputElement.boundingBox();
			const removeButtonBox = await removeButton.boundingBox();

			if (!inputBox || !removeButtonBox) {
				throw new Error("Expected the file input and remove button to have layout boxes");
			}

			expect(removeButtonBox.y).toBeGreaterThan(inputBox.y);
		});

		test("removing a file hides the remove button and clears the input", async ({
			mount,
			page,
		}) => {
			await mountFormFile(mount);

			const formFile = page.getByTestId("form-file");
			const inputElement = formFile.locator('input[type="file"]');

			await inputElement.setInputFiles(testFile);
			await formFile.locator('[data-part="remove"]').click();

			await expect(formFile.locator('[data-part="remove"]')).not.toBeAttached();
			await expect(inputElement).toHaveJSProperty("value", "");
		});

		test("removing a file returns focus to the input", async ({ mount, page }) => {
			await mountFormFile(mount);

			const formFile = page.getByTestId("form-file");
			const inputElement = formFile.locator('input[type="file"]');

			await inputElement.setInputFiles(testFile);
			await formFile.locator('[data-part="remove"]').click();

			await expect(inputElement).toBeFocused();
		});
	});

	test.describe("supplementary information", () => {
		testSupplementaryInfo(mountFormFile, {
			ariaTarget: (page) => page.getByTestId("form-file").locator('input[type="file"]'),
		});
	});

	test.describe("aria-invalid", () => {
		test("is set when an error is provided", async ({ mount, page }) => {
			await mountFormFile(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-file").locator('input[type="file"]')).toHaveAttribute(
				"aria-invalid",
				"true",
			);
		});

		test("is not set without an error", async ({ mount, page }) => {
			await mountFormFile(mount);

			await expect(page.getByTestId("form-file").locator('input[type="file"]')).not.toHaveAttribute(
				"aria-invalid",
			);
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormFile(mount);

			await expect(page.getByTestId("form-file")).toHaveAttribute("data-component", "form-file");
		});

		test("data-invalid is set when the field has an error", async ({ mount, page }) => {
			await mountFormFile(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-file")).toHaveAttribute("data-invalid");
		});

		test("data-invalid is not set without an error", async ({ mount, page }) => {
			await mountFormFile(mount);

			await expect(page.getByTestId("form-file")).not.toHaveAttribute("data-invalid");
		});
	});
});
