import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormComboBox from "./form-combo-box.vue";

const options = [
	{ id: "pilot-42", name: "Amelia Earhart" },
	{ id: "pilot-7", name: "Bessie Coleman" },
];

const mountFormComboBox = createMount(FormComboBox, {
	props: {
		id: "pilot",
		labelKey: "name",
		options,
		valueKey: "id",
	},
	slots: { default: "Pilot" },
});

test.describe("form-combo-box", () => {
	test("renders a labelled text control", async ({ mount, page }) => {
		await mountFormComboBox(mount);

		const input = getInput(page);

		await expect(page.getByTestId("form-combo-box")).toBeVisible();
		await expect(input).toHaveAttribute("id", "pilot");
		await expect(page.getByTestId("form-label")).toHaveAttribute("for", "pilot");
	});

	test.describe("ARIA and focus", () => {
		test("focus opens the ordered list and connects the combobox to its listbox", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount);

			const input = getInput(page);

			await input.focus();

			const listbox = page.getByTestId("form-combo-box-listbox");
			const controls = await input.getAttribute("aria-controls");

			await expect(input).toHaveAttribute("role", "combobox");
			await expect(input).toHaveAttribute("aria-expanded", "true");
			await expect(listbox).toHaveAttribute("role", "listbox");
			await expect(listbox).toHaveAttribute("id", controls);
			await expect(page.getByTestId("form-combo-box-option")).toHaveCount(2);
		});

		test("keeps the active highlight separate from the selected option", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount, { modelValue: "pilot-42" });

			const input = getInput(page);
			const options = page.getByTestId("form-combo-box-option");

			await input.focus();
			await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
			await expect(options.nth(1)).toHaveAttribute("aria-selected", "false");

			await input.press("ArrowDown");
			const firstOptionId = await options.nth(0).getAttribute("id");

			await expect(input).toHaveAttribute("aria-activedescendant", firstOptionId);
			await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");

			await input.press("ArrowDown");
			const secondOptionId = await options.nth(1).getAttribute("id");

			await expect(input).toHaveAttribute("aria-activedescendant", secondOptionId);
			await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
			await expect(options.nth(1)).toHaveAttribute("aria-selected", "false");
		});

		test("keeps DOM focus on the input while arrow keys move the highlight", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount);

			const input = getInput(page);
			const options = page.getByTestId("form-combo-box-option");

			await input.focus();
			await input.press("ArrowUp");
			const lastOptionId = await options.nth(1).getAttribute("id");

			await expect(input).toBeFocused();
			await expect(input).toHaveAttribute("aria-activedescendant", lastOptionId);
		});
	});

	test.describe("keyboard interaction", () => {
		test("Arrow Down, Arrow Up, and Enter choose the highlighted option", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount);

			const input = getInput(page);

			await input.focus();
			await input.press("ArrowDown");
			await input.press("ArrowUp");
			await input.press("Enter");

			await expect(input).toHaveValue("Bessie Coleman");
			await expect(page.getByTestId("form-combo-box-dropdown")).not.toBeAttached();
			await expect(input).toBeFocused();

			await input.press("ArrowDown");
			const options = page.getByTestId("form-combo-box-option");

			await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
		});

		test("Escape closes the list without moving focus", async ({ mount, page }) => {
			await mountFormComboBox(mount);

			const input = getInput(page);

			await input.focus();
			await input.press("ArrowDown");
			await input.press("Escape");

			await expect(page.getByTestId("form-combo-box-dropdown")).not.toBeAttached();
			await expect(input).toBeFocused();
		});

		test("caret movement preserves and text editing clears the active highlight", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount);

			const input = getInput(page);

			await input.focus();
			await input.press("ArrowDown");

			const firstOptionId = await page
				.getByTestId("form-combo-box-option")
				.nth(0)
				.getAttribute("id");

			await expect(input).toHaveAttribute("aria-activedescendant", firstOptionId);

			await input.press("ArrowLeft");
			await expect(input).toHaveAttribute("aria-activedescendant", firstOptionId);

			await input.press("ArrowDown");
			await input.press("Backspace");
			await expect(input).not.toHaveAttribute("aria-activedescendant");
		});

		test("Tab leaves without silently selecting the highlighted option", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount);

			const input = getInput(page);

			await input.focus();
			await input.press("ArrowDown");
			await input.press("Tab");

			await expect(page.getByTestId("form-combo-box-dropdown")).not.toBeAttached();
			await expect(input).toHaveValue("");
		});
	});

	test.describe("selection", () => {
		test("pointer selection sets the label, closes the list, and keeps focus on the input", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount);

			const input = getInput(page);

			await input.focus();
			await page.getByTestId("form-combo-box-option").nth(1).click();

			await expect(input).toHaveValue("Bessie Coleman");
			await expect(page.getByTestId("form-combo-box-dropdown")).not.toBeAttached();
			await expect(input).toBeFocused();
		});

		test("editing a selected label clears the selection before leaving", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount, { modelValue: "pilot-42" });

			const input = getInput(page);

			await input.fill("Amelia");
			await input.press("Tab");
			await expect(input).toHaveValue("");

			await input.focus();
			await input.press("ArrowDown");
			await expect(page.getByTestId("form-combo-box-option").nth(0)).toHaveAttribute(
				"aria-selected",
				"false",
			);
		});

		test("does not auto-select an exact label typed by the user", async ({ mount, page }) => {
			await mountFormComboBox(mount);

			const input = getInput(page);

			await input.fill("Amelia Earhart");
			await input.press("Tab");
			await expect(input).toHaveValue("");

			await input.focus();
			await input.press("ArrowDown");
			await expect(page.getByTestId("form-combo-box-option").nth(0)).toHaveAttribute(
				"aria-selected",
				"false",
			);
		});
	});

	test.describe("announcements and states", () => {
		test("announces result counts and selection changes", async ({ mount, page }) => {
			await mountFormComboBox(mount);

			const input = getInput(page);
			const announcement = page.getByTestId("form-combo-box-announcement");

			await input.focus();
			await expect(announcement).toHaveText("2 results found. Use the arrow keys to navigate.");

			await input.press("ArrowDown");
			await input.press("Enter");
			await expect(announcement).toHaveText("Selected Amelia Earhart.");
		});

		test("announces loading state and renders the loading slot", async ({ mount, page }) => {
			await mountFormComboBox(mount, {
				props: { loading: true },
				slots: { loading: "Loading pilots" },
			});

			const input = getInput(page);

			await input.focus();

			await expect(page.getByTestId("form-combo-box-loading")).toHaveText("Loading pilots");
			await expect(page.getByTestId("form-combo-box-announcement")).toHaveText("Loading options.");
		});

		test("announces no results for the current query", async ({ mount, page }) => {
			await mountFormComboBox(mount);

			const input = getInput(page);

			await input.fill("Unknown");

			await expect(page.getByTestId("form-combo-box-no-results")).toHaveText(
				'No results found for "Unknown"',
			);
			await expect(page.getByTestId("form-combo-box-announcement")).toHaveText(
				'No results found for "Unknown".',
			);
		});

		test("announces and renders an empty option list", async ({ mount, page }) => {
			await mountFormComboBox(mount, {
				props: { options: [] },
				slots: { empty: "No pilots" },
			});

			const input = getInput(page);

			await input.focus();

			await expect(page.getByTestId("form-combo-box-empty")).toHaveText("No pilots");
			await expect(page.getByTestId("form-combo-box-announcement")).toHaveText(
				"No options available.",
			);
		});
	});

	test.describe("form state and slots", () => {
		test("exposes required and invalid state on the text input", async ({ mount, page }) => {
			await mountFormComboBox(mount, {
				props: { required: true },
				slots: { error: "Choose a pilot" },
			});

			const input = getInput(page);

			await expect(input).toHaveAttribute("required");
			await expect(input).toHaveAttribute("aria-required", "true");
			await expect(input).toHaveAttribute("aria-invalid", "true");
			await expect(input).toHaveAttribute("aria-errormessage", "pilot-error");
			await expect(input).toHaveAttribute("aria-describedby", /pilot-error/);
		});

		test("keeps a readonly selection visible without opening or changing it", async ({
			mount,
			page,
		}) => {
			await mountFormComboBox(mount, { modelValue: "pilot-42", readonly: true });

			const input = getInput(page);

			await expect(input).toHaveAttribute("readonly");
			await expect(input).toHaveValue("Amelia Earhart");
			await input.focus();
			await input.press("ArrowDown");

			await expect(page.getByTestId("form-combo-box-dropdown")).not.toBeAttached();
			await expect(input).toHaveValue("Amelia Earhart");
		});

		test("renders rich non-interactive option content", async ({ mount, page }) => {
			await mountFormComboBox(mount, {
				slots: { option: '<span data-test="rich-option">Pilot details</span>' },
			});

			const input = getInput(page);

			await input.focus();

			await expect(page.getByTestId("rich-option").first()).toHaveText("Pilot details");
		});
	});

	test("attaches default and narrow list screenshots for browser review", async ({
		mount,
		page,
	}) => {
		await mountFormComboBox(mount, {
			slots: { option: '<span data-test="rich-option">Pilot details</span>' },
		});

		const input = getInput(page);

		await input.focus();
		await test.info().attach("form-combo-box-default-list", {
			body: await page.screenshot(),
			contentType: "image/png",
		});

		await page.setViewportSize({ width: 360, height: 640 });
		await test.info().attach("form-combo-box-narrow-list", {
			body: await page.screenshot(),
			contentType: "image/png",
		});
	});
});

/**
 * Get the text input rendered by the form field.
 *
 * @param  {import("@playwright/test").Page}  page
 *     The page containing the mounted component.
 * @returns {import("@playwright/test").Locator}
 *     The combo-box text input.
 */
function getInput(page) {
	return page.getByTestId("form-combo-box-input").locator("input");
}
