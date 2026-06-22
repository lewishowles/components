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
		await expect(labels.nth(0)).toHaveText("Best smoothie(optional)");
		await expect(labels.nth(1)).toHaveText("Pineapple");
		await expect(labels.nth(2)).toHaveText("Banana");
		await expect(labels.nth(3)).toHaveText("Coconut");
		await expect(formRadioGroup.getByTestId("form-label-optional-indicator")).toHaveCount(1);
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
