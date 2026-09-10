import { expect, test } from "@playwright/experimental-ct-vue";
import { testSupplementaryInfo } from "#test/ct/support/form-supplementary.js";
import { createMount } from "@lewishowles/testing/playwright";

import ButtonGroup from "./form-button-group.vue";

// Mount form-button-group with sensible defaults for testing.
const mountButtonGroup = createMount(ButtonGroup, {
	props: { id: "id-abc", options: ["Pineapple", "Banana", "Coconut"] },
	slots: { default: "Best smoothie" },
});

test.describe("form-button-group", () => {
	test("a button group is rendered", async ({ mount, page }) => {
		await mountButtonGroup(mount);

		const buttonGroup = page.getByTestId("form-button-group");

		await expect(buttonGroup).toBeVisible();

		const labels = buttonGroup.getByTestId("form-label");

		await expect(labels).toHaveCount(4);
		await expect(labels.nth(0)).toHaveText("Best smoothie");
		await expect(labels.nth(1)).toHaveText("Pineapple");
		await expect(labels.nth(2)).toHaveText("Banana");
		await expect(labels.nth(3)).toHaveText("Coconut");
		// No form-wrapper ancestor is providing context here, so the optional
		// indicator is suppressed (see form-label.test.js for the form-wrapper case).
		await expect(buttonGroup.getByTestId("form-label-optional-indicator")).toHaveCount(0);
	});

	test("keeps a visually hidden legend available to screen readers", async ({ mount, page }) => {
		await mountButtonGroup(mount, { displayLabel: false });

		const buttonGroup = page.getByTestId("form-button-group");
		const legend = buttonGroup.getByTestId("form-label").first();

		await expect(buttonGroup).toHaveAccessibleName("Best smoothie");
		await expect(buttonGroup).toHaveAttribute("aria-labelledby", "id-abc-label");
		await expect(legend).toBeAttached();
		await expect(legend).toHaveAttribute("id", "id-abc-label");
		await expect(legend.locator("xpath=..")).toHaveClass(/sr-only/);
	});

	test("stacks options below the container breakpoint", async ({ mount, page }) => {
		await mountButtonGroup(mount);

		const buttonGroup = page.getByTestId("form-button-group");
		const options = buttonGroup.getByTestId("form-input-group-options");
		const optionLabels = options.getByTestId("form-label");

		await expect(options).toHaveAttribute("data-layout", "inline");
		await expect(options).toHaveCSS("flex-direction", "row");
		await expect(options).toHaveCSS("gap", "0px");
		await expect(optionLabels.first()).toHaveCSS("border-start-end-radius", "0px");
		await expect(optionLabels.last()).toHaveCSS("border-end-start-radius", "0px");

		await page.setViewportSize({ width: 375, height: 640 });

		await expect(options).toHaveCSS("flex-direction", "column");
		await expect(options).toHaveCSS("gap", "0px");
		await test.info().attach("form-button-group-stacked", {
			body: await buttonGroup.screenshot(),
			contentType: "image/png",
		});
	});

	test("rounds all corners for a single option in the row layout", async ({ mount, page }) => {
		await mountButtonGroup(mount, { props: { options: ["Pineapple"] } });

		const buttonGroup = page.getByTestId("form-button-group");
		const options = buttonGroup.getByTestId("form-input-group-options");
		const optionLabel = options.getByTestId("form-label");

		await expect(options).toHaveCSS("flex-direction", "row");

		const cornerRadii = await optionLabel.evaluate((element) => {
			const styles = getComputedStyle(element);

			return [
				styles.borderStartStartRadius,
				styles.borderStartEndRadius,
				styles.borderEndStartRadius,
				styles.borderEndEndRadius,
			];
		});

		expect(cornerRadii[0]).not.toBe("0px");
		expect(new Set(cornerRadii).size).toBe(1);
	});

	test.describe("supplementary information", () => {
		test("an introduction can be supplied", async ({ mount, page }) => {
			await mountButtonGroup(mount, { slots: { introduction: "Introductory text" } });

			const introElement = page.getByTestId("form-input-group-introduction");

			await expect(introElement).toBeVisible();
			await expect(introElement).toHaveText("Introductory text");
		});

		testSupplementaryInfo(mountButtonGroup, {
			ariaTarget: (page) => page.getByTestId("form-button-group"),
		});
	});
});
