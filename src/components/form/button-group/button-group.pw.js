import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount } from "@lewishowles/testing/playwright";

import ButtonGroup from "./button-group.vue";

// Mount button-group with sensible defaults for testing.
const mountButtonGroup = createMount(ButtonGroup, {
	props: { id: "id-abc", options: ["Pineapple", "Banana", "Coconut"] },
	slots: { default: "Best smoothie" },
});

test.describe("button-group", () => {
	test("a button group is rendered", async ({ mount, page }) => {
		await mountButtonGroup(mount);

		const buttonGroup = page.getByTestId("button-group");

		await expect(buttonGroup).toBeVisible();

		const labels = buttonGroup.getByTestId("form-label");

		await expect(labels).toHaveCount(4);
		await expect(labels.nth(0)).toHaveText("Best smoothie");
		await expect(labels.nth(1)).toHaveText("Pineapple");
		await expect(labels.nth(2)).toHaveText("Banana");
		await expect(labels.nth(3)).toHaveText("Coconut");
	});

	test.describe("supplementary information", () => {
		test("an introduction can be supplied", async ({ mount, page }) => {
			await mountButtonGroup(mount, { slots: { introduction: "Introductory text" } });

			const introElement = page.getByTestId("form-input-group-introduction");

			await expect(introElement).toBeVisible();
			await expect(introElement).toHaveText("Introductory text");
		});

		testSupplementaryInfo(mountButtonGroup, {
			ariaTarget: (page) => page.getByTestId("button-group"),
		});
	});
});
