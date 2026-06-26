import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount, slotSvg } from "@lewishowles/testing/playwright";

import FormInput from "./form-input.vue";

const mountFormInput = createMount(FormInput, {
	props: { id: "id-abc" },
	slots: { default: "Your name" },
});

test.describe("form-input", () => {
	test("a text input is rendered", async ({ mount, page }) => {
		await mountFormInput(mount);

		const formInput = page.getByTestId("form-input");

		await expect(formInput).toBeVisible();

		const inputElement = formInput.locator("input");

		await expect(inputElement).toHaveAttribute("id", "id-abc");
		await expect(inputElement).not.toHaveAttribute("type");

		const labelElement = formInput.getByTestId("form-label");

		await expect(labelElement).toHaveText("Your name(optional)");
		await expect(labelElement).toHaveAttribute("for", "id-abc");
	});

	test("additional attributes can be provided to the input", async ({ mount, page }) => {
		await mountFormInput(mount, {
			inputAttributes: { autocomplete: "given-name", type: "password" },
		});

		const inputElement = page.getByTestId("form-input").locator("input");

		await expect(inputElement).toHaveAttribute("autocomplete", "given-name");
		await expect(inputElement).toHaveAttribute("type", "password");
	});

	test.describe("supplementary information", () => {
		test("an introduction can be supplied", async ({ mount, page }) => {
			await mountFormInput(mount, { slots: { introduction: "Introductory text" } });

			const introElement = page.getByTestId("form-input-introduction");

			await expect(introElement).toBeVisible();
			await expect(introElement).toHaveText("Introductory text");
		});

		testSupplementaryInfo(mountFormInput, {
			ariaTarget: (page) => page.getByTestId("form-input").locator("input"),
		});
	});

	test.describe("aria-invalid", () => {
		test("is set when an error is provided", async ({ mount, page }) => {
			await mountFormInput(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-input").locator("input")).toHaveAttribute(
				"aria-invalid",
				"true",
			);
		});

		test("is not set without an error", async ({ mount, page }) => {
			await mountFormInput(mount);

			await expect(page.getByTestId("form-input").locator("input")).not.toHaveAttribute(
				"aria-invalid",
			);
		});
	});

	test.describe("decoration", () => {
		test("an icon can be added to the start", async ({ mount, page }) => {
			await mountFormInput(mount, {
				slots: { prefix: slotSvg },
			});

			await expect(page.getByTestId("form-prefix").locator("svg")).toBeVisible();
		});

		test("an icon can be added to the end", async ({ mount, page }) => {
			await mountFormInput(mount, {
				slots: { suffix: slotSvg },
			});

			await expect(page.getByTestId("form-suffix").locator("svg")).toBeVisible();
		});

		test("text can be added to the start", async ({ mount, page }) => {
			await mountFormInput(mount, { slots: { prefix: "https://" } });

			const prefixElement = page.getByTestId("form-prefix");

			await expect(prefixElement).toBeVisible();
			await expect(prefixElement).toHaveText("https://");
		});

		test("text can be added to the end", async ({ mount, page }) => {
			await mountFormInput(mount, { slots: { suffix: "mph" } });

			const suffixElement = page.getByTestId("form-suffix");

			await expect(suffixElement).toBeVisible();
			await expect(suffixElement).toHaveText("mph");
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormInput(mount);

			await expect(page.getByTestId("form-input")).toHaveAttribute("data-component", "form-input");
		});

		test("data-invalid is set when the field has an error", async ({ mount, page }) => {
			await mountFormInput(mount, { slots: { error: "Error text" } });

			await expect(page.getByTestId("form-input")).toHaveAttribute("data-invalid");
		});

		test("data-invalid is not set without an error", async ({ mount, page }) => {
			await mountFormInput(mount);

			await expect(page.getByTestId("form-input")).not.toHaveAttribute("data-invalid");
		});
	});
});
