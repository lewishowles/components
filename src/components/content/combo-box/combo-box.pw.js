import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import ComboBoxFixture from "./combo-box.fixture.vue";

const mountComboBox = createMount(ComboBoxFixture);

test.describe("combo-box", () => {
	test("a component is rendered", async ({ mount, page }) => {
		await mountComboBox(mount);

		await expect(page.getByTestId("combo-box")).toBeVisible();
		await expect(page.getByTestId("combo-box-input")).toBeVisible();
	});

	test("the label can be visually hidden", async ({ mount, page }) => {
		await mountComboBox(mount, { displayLabel: false });

		const labelElement = page.getByTestId("form-label");

		await expect(labelElement).toHaveClass(/sr-only/);
		await expect(labelElement.locator("..")).toHaveAttribute("data-part", "field");
	});

	test("the results are hidden until a query is entered", async ({ mount, page }) => {
		await mountComboBox(mount);

		const dropdown = page.getByTestId("combo-box-dropdown");

		await expect(dropdown).toBeAttached();
		await expect(dropdown).toBeHidden();
		await expect(dropdown).toHaveAttribute("data-state", "closed");
		await expect(dropdown).toHaveAttribute("inert", "");

		await getInput(page).fill("a");

		await expect(dropdown).toBeVisible();
		await expect(dropdown).toHaveAttribute("data-state", "open");
		await expect(dropdown).not.toHaveAttribute("inert");
		await expect(page.getByTestId("combo-box-option")).toHaveCount(3);
	});

	test("hides the closed results immediately with reduced motion", async ({ mount, page }) => {
		await page.setViewportSize({ width: 1200, height: 800 });
		await page.emulateMedia({ reducedMotion: "reduce" });
		await mountComboBox(mount);

		const dropdown = page.getByTestId("combo-box-dropdown");
		const input = getInput(page);

		await expect(dropdown).toBeHidden();
		await input.fill("a");
		await expect(dropdown).toBeVisible();
		await input.press("Escape");
		await expect(dropdown).toHaveAttribute("data-state", "closed");
		expect(await dropdown.evaluate((element) => getComputedStyle(element).display)).toBe("none");
		await expect(dropdown).toBeHidden();
	});

	test("fades out without losing its flipped position", async ({ mount, page }) => {
		await page.setViewportSize({ width: 1200, height: 800 });
		await page.emulateMedia({ reducedMotion: "no-preference" });
		await mountComboBox(mount);

		const dropdown = page.getByTestId("combo-box-dropdown");
		const input = getInput(page);

		await page.getByTestId("combo-box").evaluate((element) => {
			element.style.position = "fixed";
			element.style.bottom = "8px";
		});
		await dropdown.evaluate((element) => {
			element.style.setProperty("--reveal-exit-duration", "1s");
		});

		await input.fill("a");
		await expect(dropdown).toBeVisible();
		await expect(dropdown).toHaveClass(/bottom-full/);
		await input.press("Escape");
		await expect(dropdown).toHaveAttribute("data-state", "closed");
		await expect(dropdown).toHaveClass(/bottom-full/);
		await expect(dropdown).toBeVisible();
		await expect(dropdown).toBeHidden();
	});

	test.describe("ARIA", () => {
		test('the input has role="combobox"', async ({ mount, page }) => {
			await mountComboBox(mount);

			await expect(getInput(page)).toHaveAttribute("role", "combobox");
		});

		test("the input reflects the closed state in aria-expanded", async ({ mount, page }) => {
			await mountComboBox(mount);

			await expect(getInput(page)).toHaveAttribute("aria-expanded", "false");
		});

		test("the input reflects the open state in aria-expanded", async ({ mount, page }) => {
			await mountComboBox(mount);

			await getInput(page).fill("a");

			await expect(getInput(page)).toHaveAttribute("aria-expanded", "true");
		});

		test('the results list has role="listbox"', async ({ mount, page }) => {
			await mountComboBox(mount);

			await getInput(page).fill("a");

			await expect(page.getByTestId("combo-box-listbox")).toHaveAttribute("role", "listbox");
		});

		test("the input's aria-controls matches the listbox id", async ({ mount, page }) => {
			await mountComboBox(mount);

			await getInput(page).fill("a");

			const controls = await getInput(page).getAttribute("aria-controls");

			await expect(page.getByTestId("combo-box-listbox")).toHaveAttribute("id", controls);
		});

		test('each option has role="option"', async ({ mount, page }) => {
			await mountComboBox(mount);

			await getInput(page).fill("a");

			await expect(page.getByTestId("combo-box-option").first()).toHaveAttribute("role", "option");
		});
	});

	test.describe("keyboard navigation", () => {
		test("arrow keys move the highlight through the options", async ({ mount, page }) => {
			await mountComboBox(mount);

			await getInput(page).fill("a");

			await getInput(page).press("ArrowDown");
			await expect(page.getByTestId("combo-box-option").nth(0)).toHaveAttribute(
				"aria-selected",
				"true",
			);

			await getInput(page).press("ArrowDown");
			await expect(page.getByTestId("combo-box-option").nth(1)).toHaveAttribute(
				"aria-selected",
				"true",
			);
			await expect(page.getByTestId("combo-box-option").nth(0)).toHaveAttribute(
				"aria-selected",
				"false",
			);
		});

		test("Enter chooses the highlighted option and clears the query", async ({ mount, page }) => {
			await mountComboBox(mount);

			await getInput(page).fill("a");
			await getInput(page).press("ArrowDown");
			await getInput(page).press("Enter");

			await expect(getInput(page)).toHaveValue("");
			await expect(page.getByTestId("combo-box-dropdown")).toBeHidden();
		});

		test("Escape closes the results", async ({ mount, page }) => {
			await mountComboBox(mount);

			const dropdown = page.getByTestId("combo-box-dropdown");

			await getInput(page).fill("a");
			await getInput(page).press("Escape");

			await expect(dropdown).toHaveAttribute("data-state", "closed");
			await expect(dropdown).toHaveAttribute("inert", "");
			await expect(dropdown).toBeHidden();
		});
	});

	test.describe("selection", () => {
		test("clicking an option emits select with the original item", async ({ mount, page }) => {
			await mountComboBox(mount);

			await getInput(page).fill("a");

			await page.getByTestId("combo-box-option").nth(1).click();

			await expect(page.getByTestId("selected-item")).toHaveAttribute("data-selected", "2");
		});

		test("choosing an option clears the query and closes the results", async ({ mount, page }) => {
			await mountComboBox(mount);

			await getInput(page).fill("a");

			await page.getByTestId("combo-box-option").first().click();

			await expect(getInput(page)).toHaveValue("");
			await expect(page.getByTestId("combo-box-dropdown")).toBeHidden();
		});
	});

	test.describe("closing", () => {
		test("clicking outside the component closes the results", async ({ mount, page }) => {
			await mountComboBox(mount);

			await page.evaluate(() => {
				const element = document.createElement("div");

				element.setAttribute("data-test", "click-target");
				element.textContent = "Click target";
				element.style.cssText = "position: fixed; bottom: 0; right: 0; z-index: 9999;";
				document.body.appendChild(element);
			});

			await getInput(page).fill("a");
			await page.getByTestId("click-target").click();

			await expect(page.getByTestId("combo-box-dropdown")).toBeHidden();

			await page.evaluate(() => {
				document.querySelector("[data-test='click-target']")?.remove();
			});
		});

		test("moving focus outside the component closes the results", async ({ mount, page }) => {
			await mountComboBox(mount);

			await page.evaluate(() => {
				const element = document.createElement("button");

				element.setAttribute("data-test", "focus-target");
				element.textContent = "Focus target";
				element.style.cssText = "position: fixed; bottom: 0; right: 0; z-index: 9999;";
				document.body.appendChild(element);
			});

			await getInput(page).fill("a");
			await page.getByTestId("focus-target").focus();

			await expect(page.getByTestId("combo-box-dropdown")).toBeHidden();

			await page.evaluate(() => {
				document.querySelector("[data-test='focus-target']")?.remove();
			});
		});
	});

	test.describe("states", () => {
		test("shows a message while loading", async ({ mount, page }) => {
			await mountComboBox(mount, { loading: true, items: [] });

			await getInput(page).fill("a");

			await expect(page.getByTestId("combo-box-loading")).toBeVisible();
			await expect(page.getByTestId("combo-box-listbox")).not.toBeVisible();
		});

		test("shows a message when there are no results", async ({ mount, page }) => {
			await mountComboBox(mount, { items: [] });

			await getInput(page).fill("xyz");

			await expect(page.getByTestId("combo-box-no-results")).toBeVisible();
			await expect(page.getByTestId("combo-box-option")).toHaveCount(0);
		});
	});

	test.describe("styling", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountComboBox(mount);

			await expect(page.getByTestId("combo-box")).toHaveAttribute("data-component", "combo-box");
		});

		test("additional classes can be applied to the results list", async ({ mount, page }) => {
			await mountComboBox(mount, { dropdownClasses: "test-dropdown-class" });

			await getInput(page).fill("a");

			await expect(page.getByTestId("combo-box-dropdown")).toHaveClass(/test-dropdown-class/);
		});
	});
});

function getInput(page) {
	return page.getByTestId("combo-box-input").locator("input");
}
