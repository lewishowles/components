import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import UiButton from "./ui-button.vue";

// Mount ui-button with sensible defaults for testing.
const mountUiButton = createMount(UiButton, { slots: { default: "Click me" } });

test.describe("ui-button", () => {
	test("renders a ui-button", async ({ mount, page }) => {
		await mountUiButton(mount);

		const button = page.getByTestId("ui-button");

		await expect(button).toBeVisible();
		await expect(button).toHaveAttribute("data-component", "ui-button");
	});

	test("uses caller-provided component and test hooks", async ({ mount, page }) => {
		await mountUiButton(mount, {
			props: {
				"data-component": "custom-ui-button",
				"data-test": "custom-ui-button",
			},
		});

		const button = page.getByTestId("custom-ui-button");

		await expect(button).toBeVisible();
		await expect(button).toHaveAttribute("data-component", "custom-ui-button");
		await expect(page.getByTestId("ui-button")).not.toBeAttached();
	});

	test("renders icon-only variants as square touch targets", async ({ mount, page }) => {
		await mountUiButton(mount, {
			class: "button--ghost",
			iconOnly: true,
			iconStart: "icon-cross",
		});

		const button = page.getByTestId("ui-button");
		const bounds = await button.boundingBox();

		expect(bounds?.width).toBe(bounds?.height);
		expect(bounds?.width).toBeGreaterThanOrEqual(44);
	});

	test("uses semantic surfaces and borders for ghost interaction states", async ({
		mount,
		page,
	}) => {
		await mountUiButton(mount, { class: "button--ghost" });

		const button = page.getByTestId("ui-button");

		await button.hover();

		await expect
			.poll(() =>
				buttonUsesStateColours(button, "--control-muted-surface-hover", "--control-border-hover"),
			)
			.toBe(true);

		await page.mouse.down();

		await expect
			.poll(() =>
				buttonUsesStateColours(button, "--control-muted-surface-active", "--control-border-active"),
			)
			.toBe(true);

		await page.mouse.up();
	});
});

/**
 * Check whether a button has reached its expected interaction colours.
 *
 * @param  {import("@playwright/test").Locator}  button
 *     The rendered button.
 * @param  {string}  backgroundToken
 *     The expected background token name.
 * @param  {string}  borderToken
 *     The expected border token name.
 * @returns  {Promise<boolean>}
 *     Whether both rendered colours match their semantic tokens.
 */
async function buttonUsesStateColours(button, backgroundToken, borderToken) {
	const colours = await getButtonStateColours(button, backgroundToken, borderToken);

	return (
		colours.background === colours.expectedBackground && colours.border === colours.expectedBorder
	);
}

/**
 * Read a button's rendered colours alongside the expected semantic tokens.
 *
 * @param  {import("@playwright/test").Locator}  button
 *     The rendered button.
 * @param  {string}  backgroundToken
 *     The expected background token name.
 * @param  {string}  borderToken
 *     The expected border token name.
 * @returns  {Promise<object>}
 *     The rendered and expected colour values.
 */
function getButtonStateColours(button, backgroundToken, borderToken) {
	return button.evaluate(
		(element, { backgroundToken, borderToken }) => {
			const probe = document.createElement("span");

			probe.style.backgroundColor = `var(${backgroundToken})`;
			probe.style.borderColor = `var(${borderToken})`;
			element.append(probe);

			const buttonStyles = getComputedStyle(element);
			const probeStyles = getComputedStyle(probe);

			const values = {
				background: buttonStyles.backgroundColor,
				border: buttonStyles.borderColor,
				expectedBackground: probeStyles.backgroundColor,
				expectedBorder: probeStyles.borderColor,
			};

			probe.remove();

			return values;
		},
		{ backgroundToken, borderToken },
	);
}
