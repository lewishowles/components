import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import FormField from "./form-field.vue";

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
	[{ type: "button-group", options: [] }, "button-group"],
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
});
