import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormField from "./form-field.vue";
import ParentFormWrapperFixture from "./fixtures/parent-form-wrapper.fixture.vue";

// Mount form-field with sensible defaults for testing.
const mountFormField = createMount(FormField, {
	props: { name: "name" },
	slots: { default: "Your name" },
});

const fieldTypes = [
	[{ type: "text" }, "form-input"],
	[{ type: "email" }, "form-input"],
	[{ type: "password" }, "form-input"],
	[{ type: "textarea" }, "form-textarea"],
	[{ type: "checkbox" }, "form-checkbox"],
	[{ type: "radio-group", options: [] }, "form-radio-group"],
	[{ type: "checkbox-group", options: [] }, "form-checkbox-group"],
	[{ type: "button-group", options: [] }, "form-button-group"],
];

test.describe("form-field", () => {
	for (const [props, component] of fieldTypes) {
		test(`renders ${component} for type "${props.type}"`, async ({ mount, page }) => {
			await mountFormField(mount, { props });

			await expect(page.getByTestId(component)).toBeVisible();
		});
	}

	test("renders the default field type", async ({ mount, page }) => {
		await mountFormField(mount);

		await expect(page.getByTestId("form-input")).toBeVisible();
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
