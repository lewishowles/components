import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import FieldWrapper from "./fragments/field-wrapper/field-wrapper.vue";
import FormActions from "./form-actions/form-actions.vue";
import FormError from "./fragments/form-error/form-error.vue";
import FormHelp from "./fragments/form-help/form-help.vue";
import FormLabel from "./form-label/form-label.vue";
import FormLayout from "./form-layout/form-layout.vue";
import FormPrefix from "./fragments/form-prefix/form-prefix.vue";
import FormSuffix from "./fragments/form-suffix/form-suffix.vue";
import FormSupplementary from "./fragments/form-supplementary/form-supplementary.vue";

const mountFieldWrapper = createMount(FieldWrapper, { slots: { default: "Field" } });
const mountFormActions = createMount(FormActions, { slots: { default: "Form placeholder" } });
const mountFormError = createMount(FormError, { slots: { default: "Error message" } });
const mountFormHelp = createMount(FormHelp, { slots: { default: "Help text" } });

const mountFormLabel = createMount(FormLabel, {
	props: { id: "id-abc" },
	slots: { default: "Your name" },
});

const mountFormLayout = createMount(FormLayout, { slots: { default: "Form placeholder" } });
const mountFormPrefix = createMount(FormPrefix, { slots: { default: "£" } });
const mountFormSuffix = createMount(FormSuffix, { slots: { default: ".com" } });
const mountFormSupplementary = createMount(FormSupplementary, { props: { inputId: "id-abc" } });

test.describe("form fragments", () => {
	test.describe("field-wrapper", () => {
		test("a component is rendered", async ({ mount, page }) => {
			await mountFieldWrapper(mount);

			await expect(page.getByTestId("field-wrapper")).toBeVisible();
		});
	});

	test.describe("form-actions", () => {
		test("renders a form actions wrapper", async ({ mount, page }) => {
			await mountFormActions(mount);

			await expect(page.getByTestId("form-actions")).toBeVisible();
		});
	});

	test.describe("form-error", () => {
		test("renders an error", async ({ mount, page }) => {
			await mountFormError(mount);

			await expect(page.getByTestId("form-error")).toBeVisible();
		});
	});

	test.describe("form-help", () => {
		test("renders help", async ({ mount, page }) => {
			await mountFormHelp(mount);

			await expect(page.getByTestId("form-help")).toBeVisible();
		});
	});

	test.describe("form-label", () => {
		test("a label is rendered with a for attribute", async ({ mount, page }) => {
			await mountFormLabel(mount);

			await expect(page.getByTestId("form-label")).toBeVisible();
			await expect(page.getByTestId("form-label")).toHaveAttribute("for", "id-abc");
		});
	});

	test.describe("form-layout", () => {
		test("renders a form layout", async ({ mount, page }) => {
			await mountFormLayout(mount);

			await expect(page.getByTestId("form-layout")).toBeVisible();
		});
	});

	test.describe("form-prefix", () => {
		test("a component is rendered", async ({ mount, page }) => {
			await mountFormPrefix(mount);

			await expect(page.getByTestId("form-prefix")).toBeVisible();
		});
	});

	test.describe("form-suffix", () => {
		test("a component is rendered", async ({ mount, page }) => {
			await mountFormSuffix(mount);

			await expect(page.getByTestId("form-suffix")).toBeVisible();
		});
	});

	test.describe("form-supplementary", () => {
		test("renders nothing without supplementary content", async ({ mount, page }) => {
			await mountFormSupplementary(mount);

			await expect(page.getByTestId("form-help")).not.toBeAttached();
		});
	});
});
