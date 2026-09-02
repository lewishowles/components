import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount } from "@lewishowles/testing/playwright";

import FormCheckboxGroup from "./form-checkbox-group.vue";

// Mount form-checkbox-group with sensible defaults for testing.
const mountFormCheckboxGroup = createMount(FormCheckboxGroup, {
	props: { id: "id-abc", options: ["Pineapple", "Banana", "Coconut"] },
	slots: { default: "Best smoothie" },
});

test.describe("form-checkbox-group", () => {
	test("a checkbox group is rendered", async ({ mount, page }) => {
		await mountFormCheckboxGroup(mount);

		const formCheckboxGroup = page.getByTestId("form-checkbox-group");

		await expect(formCheckboxGroup).toBeVisible();

		const labels = formCheckboxGroup.getByTestId("form-label");

		await expect(labels).toHaveCount(4);
		await expect(labels.nth(0)).toHaveText("Best smoothie");
		await expect(labels.nth(1)).toHaveText("Pineapple");
		await expect(labels.nth(2)).toHaveText("Banana");
		await expect(labels.nth(3)).toHaveText("Coconut");
		// No form-wrapper ancestor is providing context here, so the optional
		// indicator is suppressed (see form-label.test.js for the form-wrapper case).
		await expect(formCheckboxGroup.getByTestId("form-label-optional-indicator")).toHaveCount(0);
	});

	test.describe("supplementary information", () => {
		testSupplementaryInfo(mountFormCheckboxGroup, {
			ariaTarget: (page) => page.getByTestId("form-checkbox-group"),
		});
	});

	test.describe("options", () => {
		test("renders an option description as part of its accessible name", async ({
			mount,
			page,
		}) => {
			await mountFormCheckboxGroup(mount, {
				options: [
					{
						description: "Anyone with the link can access this project.",
						label: "Public access",
						value: "public",
					},
				],
			});

			const checkbox = page.getByRole("checkbox", {
				name: "Public access Anyone with the link can access this project.",
				exact: true,
			});

			const description = page.getByTestId("form-input-group-option-description");

			await expect(description).toHaveText("Anyone with the link can access this project.");
			await expect(checkbox).toHaveAccessibleName(
				"Public access Anyone with the link can access this project.",
			);
		});

		test("focuses a card option before keyboard selection", async ({ mount, page }) => {
			await mountFormCheckboxGroup(mount, { modelValue: [], variant: "card" });

			const checkbox = page.getByRole("checkbox", { name: "Banana", exact: true });
			const card = page.getByTestId("form-input-group-option").nth(1);

			await checkbox.focus();

			await expect(checkbox).toBeFocused();

			await checkbox.press("Space");

			await expect(checkbox).toBeChecked();
			await expect(card).toHaveAttribute("data-variant", "card");
			await expect(card).toHaveAttribute("data-state", "selected");
		});

		test("forwards custom option content", async ({ mount, page }) => {
			await mountFormCheckboxGroup(mount, {
				slots: {
					option: '<span data-test="custom-option">Custom option</span>',
				},
			});

			await expect(page.getByTestId("custom-option")).toHaveCount(3);
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountFormCheckboxGroup(mount);

			await expect(page.getByTestId("form-checkbox-group")).toHaveAttribute(
				"data-component",
				"form-checkbox-group",
			);
		});
	});
});
