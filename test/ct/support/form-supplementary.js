import { expect, test } from "@playwright/experimental-ct-vue";

/**
 * Generates the three standard supplementary-information tests shared across form components:
 * help alone, error alone, and both together. Each test verifies visibility, text content,
 * element IDs, and the `aria-describedby` value on the field's interactive element.
 *
 * @param  {Function}  mountFn
 *     The component's mount function, created with `createMount`.
 * @param  {object}  options
 * @param  {Function}  options.ariaTarget
 *     A function that receives `page` and returns the locator that should carry
 *     `aria-describedby` — typically the input, textarea, or fieldset element.
 * @param  {string}  [options.id="id-abc"]
 *     The `id` prop used when mounting, which drives the help/error element IDs.
 */
export function testSupplementaryInfo(mountFn, { ariaTarget, id = "id-abc" }) {
	test("help can be supplied", async ({ mount, page }) => {
		await mountFn(mount, { slots: { help: "Help text" } });

		const helpElement = page.getByTestId("form-help");

		await expect(helpElement).toBeVisible();
		await expect(helpElement).toHaveText("Help text");
		await expect(helpElement).toHaveAttribute("id", `${id}-help`);
		await expect(ariaTarget(page)).toHaveAttribute("aria-describedby", `${id}-help`);
	});

	test("an error can be supplied", async ({ mount, page }) => {
		await mountFn(mount, { slots: { error: "Error text" } });

		const errorElement = page.getByTestId("form-error");

		await expect(errorElement).toBeVisible();
		await expect(errorElement).toHaveText("Error text");
		await expect(errorElement).toHaveAttribute("id", `${id}-error`);
		await expect(ariaTarget(page)).toHaveAttribute("aria-describedby", `${id}-error`);
	});

	test("both help and an error can be supplied", async ({ mount, page }) => {
		await mountFn(mount, { slots: { error: "Error text", help: "Help text" } });

		const helpElement = page.getByTestId("form-help");
		const errorElement = page.getByTestId("form-error");

		await expect(helpElement).toBeVisible();
		await expect(helpElement).toHaveText("Help text");
		await expect(helpElement).toHaveAttribute("id", `${id}-help`);

		await expect(errorElement).toBeVisible();
		await expect(errorElement).toHaveText("Error text");
		await expect(errorElement).toHaveAttribute("id", `${id}-error`);

		await expect(ariaTarget(page)).toHaveAttribute("aria-describedby", `${id}-help ${id}-error`);
	});
}
