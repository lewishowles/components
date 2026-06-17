import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount } from "#test/ct/support/mount.js";

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
	});

	test.describe("supplementary information", () => {
		testSupplementaryInfo(mountFormCheckboxGroup, {
			ariaTarget: (page) => page.getByTestId("form-checkbox-group"),
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
