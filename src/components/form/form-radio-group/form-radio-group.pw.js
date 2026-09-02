import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount } from "@lewishowles/testing/playwright";

import FormRadioGroup from "./form-radio-group.vue";

// Mount form-radio-group with sensible defaults for testing.
const mountFormRadioGroup = createMount(FormRadioGroup, {
	props: { id: "id-abc", options: ["Pineapple", "Banana", "Coconut"] },
	slots: { default: "Best smoothie" },
});

test.describe("form-radio-group", () => {
	test("a radio group is rendered", async ({ mount, page }) => {
		await mountFormRadioGroup(mount);

		const formRadioGroup = page.getByTestId("form-radio-group");

		await expect(formRadioGroup).toBeVisible();

		const labels = formRadioGroup.getByTestId("form-label");

		await expect(labels).toHaveCount(4);
		await expect(labels.nth(0)).toHaveText("Best smoothie");
		await expect(labels.nth(1)).toHaveText("Pineapple");
		await expect(labels.nth(2)).toHaveText("Banana");
		await expect(labels.nth(3)).toHaveText("Coconut");
		// No form-wrapper ancestor is providing context here, so the optional
		// indicator is suppressed (see form-label.test.js for the form-wrapper case).
		await expect(formRadioGroup.getByTestId("form-label-optional-indicator")).toHaveCount(0);
	});

	test.describe("supplementary information", () => {
		test("an introduction can be supplied", async ({ mount, page }) => {
			await mountFormRadioGroup(mount, { slots: { introduction: "Introductory text" } });

			const introElement = page.getByTestId("form-input-group-introduction");

			await expect(introElement).toBeVisible();
			await expect(introElement).toHaveText("Introductory text");
		});

		testSupplementaryInfo(mountFormRadioGroup, {
			ariaTarget: (page) => page.getByTestId("form-radio-group"),
		});
	});

	test.describe("options", () => {
		test("renders an option description as part of its accessible name", async ({
			mount,
			page,
		}) => {
			await mountFormRadioGroup(mount, {
				options: [
					{
						description: "Anyone with the link can access this project.",
						label: "Public access",
						value: "public",
					},
				],
			});

			const radio = page.getByRole("radio", {
				name: "Public access Anyone with the link can access this project.",
				exact: true,
			});

			const description = page.getByTestId("form-input-group-option-description");

			await expect(description).toHaveText("Anyone with the link can access this project.");
			await expect(radio).toHaveAccessibleName(
				"Public access Anyone with the link can access this project.",
			);
		});

		test("moves focus between card options with arrow keys", async ({ mount, page }) => {
			await mountFormRadioGroup(mount, { modelValue: "Pineapple", variant: "card" });

			const pineapple = page.getByRole("radio", { name: "Pineapple", exact: true });
			const banana = page.getByRole("radio", { name: "Banana", exact: true });
			const bananaCard = page.getByTestId("form-input-group-option").nth(1);

			await pineapple.focus();

			await expect(pineapple).toBeFocused();

			await pineapple.press("ArrowDown");

			await expect(banana).toBeFocused();
			await expect(banana).toBeChecked();
			await expect(bananaCard).toHaveAttribute("data-variant", "card");
			await expect(bananaCard).toHaveAttribute("data-state", "selected");
		});

		test("forwards custom option content", async ({ mount, page }) => {
			await mountFormRadioGroup(mount, {
				slots: { option: '<span data-test="custom-option">Custom option</span>' },
			});

			await expect(page.getByTestId("custom-option")).toHaveCount(3);
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormRadioGroup(mount);

			await expect(page.getByTestId("form-radio-group")).toHaveAttribute(
				"data-component",
				"form-radio-group",
			);
		});
	});
});
