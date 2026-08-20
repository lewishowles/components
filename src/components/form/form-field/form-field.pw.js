import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormField from "./form-field.vue";
import FormFieldComboBoxFixture from "./fixtures/form-field-combo-box.fixture.vue";
import FormFieldRemovalFixture from "./fixtures/form-field-removal.fixture.vue";
import FormFieldRenameFixture from "./fixtures/form-field-rename.fixture.vue";
import ParentFormWrapperFixture from "./fixtures/parent-form-wrapper.fixture.vue";

// Mount form-field with sensible defaults for testing.
const mountFormField = createMount(FormField, {
	props: { name: "name" },
	slots: { default: "Your name" },
});

// Options shared by the combo-box adapter interaction tests.
const comboBoxOptions = [
	{ id: "pilot-42", name: "Amelia Earhart" },
	{ id: "pilot-7", name: "Bessie Coleman" },
];

// Props shared by the combo-box adapter interaction tests.
const comboBoxProps = {
	labelKey: "name",
	options: comboBoxOptions,
	type: "combo-box",
	valueKey: "id",
};

// Mount the form-wrapper fixture that supplies combo-box validation rules.
const mountFormFieldComboBox = createMount(FormFieldComboBoxFixture);
// Mount the fixture that removes a required field before validation.
const mountFormFieldRemoval = createMount(FormFieldRemovalFixture);
// Mount the fixture that renames a required field without replacing it.
const mountFormFieldRename = createMount(FormFieldRenameFixture);

const fieldTypes = [
	[{ type: "text" }, "form-input"],
	[{ type: "email" }, "form-input"],
	[{ type: "password" }, "form-input"],
	[{ type: "textarea" }, "form-textarea"],
	[{ type: "checkbox" }, "form-checkbox"],
	[{ type: "radio-group", options: [] }, "form-radio-group"],
	[{ type: "checkbox-group", options: [] }, "form-checkbox-group"],
	[{ type: "button-group", options: [] }, "form-button-group"],
	[{ type: "combo-box", options: [] }, "form-combo-box"],
];

test.describe("form-field", () => {
	for (const [props, component] of fieldTypes) {
		test(`renders ${component} for type "${props.type}"`, async ({ mount, page }) => {
			await mountFormField(mount, { props });

			await expect(page.getByTestId(component)).toBeVisible();
		});
	}

	test.describe("combo-box", () => {
		test("keeps active and selected options separate while keyboard focus stays on the input", async ({
			mount,
			page,
		}) => {
			await mountFormField(mount, { props: { ...comboBoxProps, modelValue: "pilot-42" } });

			const input = page.getByRole("combobox");
			const options = page.getByRole("option");

			await input.focus();
			await expect(input).toHaveValue("Amelia Earhart");
			await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
			await expect(options.nth(1)).toHaveAttribute("aria-selected", "false");

			await input.press("ArrowDown");
			const firstOptionId = await options.nth(0).getAttribute("id");

			await expect(input).toBeFocused();
			await expect(input).toHaveAttribute("aria-activedescendant", firstOptionId);

			await input.press("ArrowDown");
			const secondOptionId = await options.nth(1).getAttribute("id");

			await expect(input).toBeFocused();
			await expect(input).toHaveAttribute("aria-activedescendant", secondOptionId);
			await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
			await expect(options.nth(1)).toHaveAttribute("aria-selected", "false");

			await input.press("ArrowUp");
			await expect(input).toHaveAttribute("aria-activedescendant", firstOptionId);

			await input.press("ArrowDown");
			await input.press("Enter");
			await expect(input).toHaveValue("Bessie Coleman");
			await expect(input).toBeFocused();
		});

		test("selects an option by pointer without moving focus from the input", async ({
			mount,
			page,
		}) => {
			await mountFormField(mount, { props: comboBoxProps });

			const input = page.getByRole("combobox");

			await input.focus();
			await page.getByRole("option", { name: "Bessie Coleman" }).click();

			await expect(input).toHaveValue("Bessie Coleman");
			await expect(page.getByTestId("form-combo-box-dropdown")).not.toBeAttached();
			await expect(input).toBeFocused();
		});

		test("keeps a readonly selection visible without opening or changing it", async ({
			mount,
			page,
		}) => {
			await mountFormField(mount, {
				props: { ...comboBoxProps, modelValue: "pilot-42", readonly: true },
			});

			const input = page.getByRole("combobox");

			await expect(input).toHaveAttribute("readonly");
			await expect(input).toHaveValue("Amelia Earhart");

			await input.focus();
			await input.press("ArrowDown");

			await expect(page.getByTestId("form-combo-box-dropdown")).not.toBeAttached();
			await expect(input).toHaveValue("Amelia Earhart");
		});

		test("reports required validation when no combo-box option is selected", async ({
			mount,
			page,
		}) => {
			await mountFormFieldComboBox(mount);

			const input = page.getByRole("combobox");

			await page.getByTestId("form-wrapper-submit-button").click();

			await expect(page.getByTestId("form-error")).toContainText("Choose a pilot");
			await expect(input).toHaveAttribute("aria-invalid", "true");
		});

		test("reports required validation for typed but unselected text", async ({ mount, page }) => {
			await mountFormFieldComboBox(mount);

			const input = page.getByRole("combobox");

			await input.fill("Amelia");
			await expect(input).toHaveValue("Amelia");
			await page.getByTestId("form-wrapper-submit-button").click();

			await expect(page.getByTestId("form-error")).toContainText("Choose a pilot");
			await expect(input).toHaveAttribute("aria-invalid", "true");
		});

		test("focuses the combo-box input from the error summary", async ({ mount, page }) => {
			await mountFormFieldComboBox(mount);

			await page.getByTestId("form-wrapper-submit-button").click();
			await page
				.getByTestId("form-wrapper-error-summary-message")
				.filter({ hasText: "Choose a pilot" })
				.click();

			await expect(page.getByLabel("Pilot", { exact: true })).toBeFocused();
		});
	});

	test("renders the default field type", async ({ mount, page }) => {
		await mountFormField(mount);

		await expect(page.getByTestId("form-input")).toBeVisible();
	});

	test.describe("registration lifecycle", () => {
		test("removes a conditional field from error-summary links and focus targets", async ({
			mount,
			page,
		}) => {
			await mountFormFieldRemoval(mount);

			const username = page.getByLabel("Username", { exact: true });
			const usernameId = await username.getAttribute("id");

			expect(usernameId).toBeTruthy();

			await page.getByTestId("form-field-remove-username").click();
			await expect(username).not.toBeAttached();

			await page.getByTestId("form-wrapper-submit-button").click();

			const email = page.getByLabel("Email", { exact: true });
			const emailId = await email.getAttribute("id");
			const errorSummaryLink = page.getByTestId("form-wrapper-error-summary-message");

			expect(emailId).toBeTruthy();
			await expect(errorSummaryLink).toHaveCount(1);
			await expect(errorSummaryLink).toHaveAttribute("href", `#${emailId}`);
			await expect(errorSummaryLink).not.toHaveAttribute("href", `#${usernameId}`);
			await expect(page.getByTestId("form-wrapper-error-summary")).not.toContainText(
				"Enter username",
			);

			await errorSummaryLink.click();

			await expect(email).toBeFocused();
		});

		test("renames a field with one live error-summary link and focus target", async ({
			mount,
			page,
		}) => {
			await mountFormFieldRename(mount);

			await page.getByTestId("form-field-rename").click();

			const renamedField = page.getByLabel("Display name", { exact: true });
			const renamedFieldId = await renamedField.getAttribute("id");

			expect(renamedFieldId).toBeTruthy();

			await page.getByTestId("form-wrapper-submit-button").click();

			const errorSummary = page.getByTestId("form-wrapper-error-summary");
			const errorSummaryLink = page.getByTestId("form-wrapper-error-summary-message");

			await expect(errorSummary).toContainText("Enter display name");
			await expect(errorSummary).not.toContainText("Enter username");
			await expect(errorSummaryLink).toHaveCount(1);
			await expect(errorSummaryLink).toHaveAttribute("href", `#${renamedFieldId}`);

			await errorSummaryLink.click();

			await expect(renamedField).toBeFocused();
		});
	});

	test("additional props are passed through to the underlying field", async ({ mount, page }) => {
		await mountFormField(mount, { props: { id: "custom-unique-id" } });

		const inputElement = page.getByTestId("form-input").locator("input");

		await expect(inputElement).toBeVisible();
		await expect(inputElement).toHaveAttribute("id", "custom-unique-id");
	});

	test("forwards a slot to the selected concrete field", async ({ mount, page }) => {
		await mountFormField(mount, {
			props: { options: ["Banana"], type: "radio-group" },
			slots: {
				default: "Favourite fruit",
				option: '<span data-test="custom-option">Custom option</span>',
			},
		});

		await expect(page.getByTestId("custom-option")).toBeVisible();
	});

	test("does not render a slot the concrete field does not use", async ({ mount, page }) => {
		await mountFormField(mount, {
			slots: { "unrecognised-slot": '<span data-test="unrecognised-slot">Unused content</span>' },
		});

		await expect(page.getByTestId("unrecognised-slot")).not.toBeAttached();
	});

	test("allows a consumer error slot to override the default error content", async ({
		mount,
		page,
	}) => {
		await mountFormField(mount, {
			slots: { error: '<span data-test="custom-error">Choose another username</span>' },
		});

		await expect(page.getByTestId("custom-error")).toBeVisible();
	});

	test.describe("displayLabel", () => {
		test("hides a text field label", async ({ mount, page }) => {
			await mountFormField(mount, { props: { displayLabel: false, type: "text" } });

			await expect(page.getByTestId("form-label")).toHaveClass(/sr-only/);
		});

		test("hides a select field label", async ({ mount, page }) => {
			await mountFormField(mount, { props: { displayLabel: false, type: "select" } });

			await expect(page.getByTestId("form-label")).toHaveClass(/sr-only/);
		});
	});

	test("uses the text field without a diagnostic for an unknown type", async ({ mount, page }) => {
		await mountFormField(mount, { props: { type: "unknown" } });

		await expect(page.getByTestId("form-field-unknown-type-error")).toHaveCount(0);
		await expect(page.getByTestId("form-input").locator("input")).toBeVisible();
	});

	test("renders without a diagnostic when name is missing", async ({ mount, page }) => {
		await mount(ParentFormWrapperFixture);

		await expect(page.getByTestId("form-field-missing-name-error")).toHaveCount(0);
		await expect(page.getByTestId("form-input")).toBeVisible();
	});

	test("passes undeclared fallthrough attributes to the field root", async ({ mount, page }) => {
		await mountFormField(mount, {
			props: { "data-analytics-id": "profile-field" },
		});

		await expect(page.getByTestId("form-input")).toHaveAttribute(
			"data-analytics-id",
			"profile-field",
		);
	});
});
