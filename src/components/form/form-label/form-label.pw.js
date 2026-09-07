import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FormLabel from "./form-label.vue";

const mountFormLabel = createMount(FormLabel, {
	props: { id: "id-abc" },
});

test.describe("form-label", () => {
	for (const tag of ["label", "legend"]) {
		test(`shows a warning without an empty ${tag}`, async ({ mount, page }) => {
			await mountFormLabel(mount, { props: { tag }, slots: { default: "" } });

			await expect(page.locator("label, legend")).toHaveCount(0);
			await expect(page.getByTestId("form-label-no-label")).toBeVisible();
			await expect(page.getByTestId("form-label-no-label")).toContainText(
				"A label is required for accessibility purposes.",
			);
			await expect(page.getByTestId("form-label-optional-indicator")).not.toBeAttached();
		});

		test(`links a populated ${tag} to its input`, async ({ mount, page }) => {
			await mountFormLabel(mount, { props: { tag }, slots: { default: "Your name" } });

			const label = page.locator(tag);

			await expect(label).toBeVisible();
			await expect(label).toHaveText("Your name");
			await expect(label).toHaveAttribute(tag === "label" ? "for" : "id", "id-abc");
			await expect(label).not.toHaveAttribute(tag === "label" ? "id" : "for");
			await expect(page.getByTestId("form-label-no-label")).not.toBeAttached();
		});
	}
});
