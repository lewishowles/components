import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormInputGroup from "./form-input-group.vue";

// Mount form-input-group with sensible defaults for testing.
const mountFormInputGroup = createMount(FormInputGroup, {
	props: { type: "radio", options: ["Yes", "No"] },
});

/**
 * Assert that two adjacent cards paint their shared border on the same pixel.
 *
 * @param  {object}  options
 *   The card option locator.
 */
async function expectOverlappingCards(options) {
	const optionBounds = await options.evaluateAll((elements) =>
		elements.map((element) => {
			const { bottom, top } = element.getBoundingClientRect();

			return { bottom, top };
		}),
	);

	expect(optionBounds[1].top).toBeCloseTo(optionBounds[0].bottom - 1);
}

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

	test.describe("options", () => {
		test("renders an option description", async ({ mount, page }) => {
			await mountFormInputGroup(mount, {
				options: [
					{
						description: "Anyone with the link can access this project.",
						label: "Public access",
						value: "public",
					},
				],
			});

			await expect(page.getByTestId("form-input-group-option-description")).toHaveText(
				"Anyone with the link can access this project.",
			);
		});

		test("overlaps borders for an unselected card after the first option", async ({
			mount,
			page,
		}) => {
			await mountFormInputGroup(mount, {
				modelValue: {},
				name: "option",
				variant: "card",
			});

			const options = page.getByTestId("form-input-group-option");

			await expect(options.nth(1)).toHaveCSS("border-top-width", "1px");
			await expect(options.nth(1)).toHaveCSS("z-index", "0");
			await expectOverlappingCards(options);
		});

		test("stacks a selected card above an unselected option", async ({ mount, page }) => {
			await mountFormInputGroup(mount, {
				modelValue: { option: "No" },
				name: "option",
				variant: "card",
			});

			const options = page.getByTestId("form-input-group-option");
			const selectedOption = options.nth(1);

			await expect(options.first()).toHaveCSS("z-index", "0");
			await expect(selectedOption).toHaveCSS("border-top-width", "1px");
			await expect(selectedOption).toHaveCSS("border-right-width", "1px");
			await expect(selectedOption).toHaveCSS("border-bottom-width", "1px");
			await expect(selectedOption).toHaveCSS("border-left-width", "1px");
			await expect(selectedOption).toHaveCSS("z-index", "10");
			await expectOverlappingCards(options);
		});

		test("stacks adjacent selected cards above unselected neighbours", async ({ mount, page }) => {
			await mountFormInputGroup(mount, {
				modelValue: { analytics: true, priority: true },
				options: [
					{ label: "Analytics", value: "analytics" },
					{ label: "Priority support", value: "priority" },
				],
				type: "checkbox",
				variant: "card",
			});

			const options = page.getByTestId("form-input-group-option");

			await expect(options.first()).toHaveCSS("border-bottom-width", "1px");
			await expect(options.first()).toHaveCSS("z-index", "10");
			await expect(options.nth(1)).toHaveCSS("border-top-width", "1px");
			await expect(options.nth(1)).toHaveCSS("z-index", "10");
			await expectOverlappingCards(options);
		});

		test("keeps a selected card above the following unselected card", async ({ mount, page }) => {
			await mountFormInputGroup(mount, {
				modelValue: { analytics: true, priority: false },
				options: [
					{ label: "Analytics", value: "analytics" },
					{ label: "Priority support", value: "priority" },
				],
				type: "checkbox",
				variant: "card",
			});

			const options = page.getByTestId("form-input-group-option");

			await expect(options.first()).toHaveCSS("border-bottom-width", "1px");
			await expect(options.first()).toHaveCSS("z-index", "10");
			await expect(options.nth(1)).toHaveCSS("border-top-width", "1px");
			await expect(options.nth(1)).toHaveCSS("z-index", "0");
			await expectOverlappingCards(options);
		});

		test("renders custom option content", async ({ mount, page }) => {
			await mountFormInputGroup(mount, {
				slots: { option: '<span data-test="custom-option">Custom option</span>' },
			});

			await expect(page.getByTestId("custom-option")).toHaveCount(2);
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
