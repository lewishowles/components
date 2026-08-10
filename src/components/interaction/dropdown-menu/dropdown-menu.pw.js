import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import DropdownMenuWithButtons from "./dropdown-menu.fixture.vue";

// Mount the full integration fixture so that dropdown-menu-button's provide/inject
// chain closes the menu on item selection, matching real usage.
const mountDropdownMenu = createMount(DropdownMenuWithButtons);

test.describe("dropdown-menu", () => {
	test("a component is rendered", async ({ mount, page }) => {
		await mountDropdownMenu(mount);

		await expect(page.getByTestId("dropdown-menu")).toBeVisible();
		await expect(page.getByTestId("dropdown-menu-trigger")).toBeVisible();
	});

	test.describe("ARIA", () => {
		test('the trigger has aria-haspopup="menu"', async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await expect(page.getByTestId("dropdown-menu-trigger")).toHaveAttribute(
				"aria-haspopup",
				"menu",
			);
		});

		test('the trigger has aria-expanded="false" when closed', async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await expect(page.getByTestId("dropdown-menu-trigger")).toHaveAttribute(
				"aria-expanded",
				"false",
			);
		});

		test('the trigger has aria-expanded="true" when open', async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();

			await expect(page.getByTestId("dropdown-menu-trigger")).toHaveAttribute(
				"aria-expanded",
				"true",
			);
		});

		test('the panel has role="menu"', async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();

			await expect(page.getByTestId("dropdown-menu-panel")).toHaveAttribute("role", "menu");
		});

		test("the trigger's aria-controls matches the panel id", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();

			const controls = await page
				.getByTestId("dropdown-menu-trigger")
				.getAttribute("aria-controls");

			await expect(page.getByTestId("dropdown-menu-panel")).toHaveAttribute("id", controls);
		});
	});

	test.describe("interaction", () => {
		test("clicking on the trigger opens the menu", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await expect(page.getByTestId("dropdown-menu-panel")).not.toBeVisible();

			await page.getByTestId("dropdown-menu-trigger").click();

			await expect(page.getByTestId("dropdown-menu-panel")).toBeVisible();
		});

		test("clicking on the trigger closes the menu", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-trigger").click();

			await expect(page.getByTestId("dropdown-menu-panel")).not.toBeVisible();
		});

		test("clicking outside the menu closes the menu", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();

			await page.evaluate(() => {
				const element = document.createElement("div");

				element.setAttribute("data-test", "click-target");
				element.textContent = "Click target";
				document.body.appendChild(element);
			});

			await page.getByTestId("click-target").click();

			await expect(page.getByTestId("dropdown-menu-panel")).not.toBeVisible();

			await page.evaluate(() => {
				document.querySelector("[data-test='click-target']")?.remove();
			});
		});

		test("Escape closes the menu and returns focus to the trigger", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.keyboard.press("Escape");

			await expect(page.getByTestId("dropdown-menu-panel")).not.toBeVisible();
			await expect(page.getByTestId("dropdown-menu-trigger")).toBeFocused();
		});
	});

	test.describe("menu item behaviour", () => {
		test("clicking a menu item closes the menu", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-button").first().click();

			await expect(page.getByTestId("dropdown-menu-panel")).not.toBeVisible();
		});

		test("clicking a menu item returns focus to the trigger", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-button").first().click();

			await expect(page.getByTestId("dropdown-menu-trigger")).toBeFocused();
		});
	});

	test.describe("keyboard navigation", () => {
		test("ArrowDown opens the menu and focuses the first item", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").focus();
			await page.getByTestId("dropdown-menu-trigger").press("ArrowDown");

			await expect(page.getByTestId("dropdown-menu-panel")).toBeVisible();
			await expect(page.getByTestId("dropdown-menu-panel").locator("button").first()).toBeFocused();
		});

		test("ArrowDown moves focus to the next item", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-panel").locator("button").first().focus();
			await page.keyboard.press("ArrowDown");

			await expect(page.getByTestId("dropdown-menu-panel").locator("button").nth(1)).toBeFocused();
		});

		test("ArrowDown wraps from the last item to the first", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-panel").locator("button").last().focus();
			await page.keyboard.press("ArrowDown");

			await expect(page.getByTestId("dropdown-menu-panel").locator("button").first()).toBeFocused();
		});

		test("ArrowUp moves focus to the previous item", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-panel").locator("button").nth(1).focus();
			await page.keyboard.press("ArrowUp");

			await expect(page.getByTestId("dropdown-menu-panel").locator("button").first()).toBeFocused();
		});

		test("ArrowUp wraps from the first item to the last", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-panel").locator("button").first().focus();
			await page.keyboard.press("ArrowUp");

			await expect(page.getByTestId("dropdown-menu-panel").locator("button").last()).toBeFocused();
		});

		test("Home moves focus to the first item", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-panel").locator("button").last().focus();
			await page.keyboard.press("Home");

			await expect(page.getByTestId("dropdown-menu-panel").locator("button").first()).toBeFocused();
		});

		test("End moves focus to the last item", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-panel").locator("button").first().focus();
			await page.keyboard.press("End");

			await expect(page.getByTestId("dropdown-menu-panel").locator("button").last()).toBeFocused();
		});

		test("type-ahead focuses the first item starting with the typed character", async ({
			mount,
			page,
		}) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-panel").locator("button").first().focus();
			await page.keyboard.press("e");

			await expect(
				page.getByTestId("dropdown-menu-panel").locator("button").filter({ hasText: "Edit" }),
			).toBeFocused();
		});

		test("type-ahead matches a multi-character prefix", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();
			await page.getByTestId("dropdown-menu-panel").locator("button").first().focus();
			await page.keyboard.press("d");
			await page.keyboard.press("u");

			await expect(
				page.getByTestId("dropdown-menu-panel").locator("button").filter({ hasText: "Duplicate" }),
			).toBeFocused();
		});
	});

	test.describe("styling hooks", () => {
		test("has data-component on the root element", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await expect(page.getByTestId("dropdown-menu")).toHaveAttribute(
				"data-component",
				"dropdown-menu",
			);
		});

		test("has data-part on the trigger", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await expect(page.getByTestId("dropdown-menu-trigger")).toHaveAttribute(
				"data-part",
				"trigger",
			);
		});

		test("has data-state=closed when the menu is closed", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await expect(page.getByTestId("dropdown-menu")).toHaveAttribute("data-state", "closed");
		});

		test("has data-state=open when the menu is open", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();

			await expect(page.getByTestId("dropdown-menu")).toHaveAttribute("data-state", "open");
		});

		test("has data-part on the panel when open", async ({ mount, page }) => {
			await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();

			await expect(page.getByTestId("dropdown-menu-panel")).toHaveAttribute("data-part", "panel");
		});

		test("the panel follows light and dark surface tokens", async ({ mount, page }) => {
			const mounted = await mountDropdownMenu(mount);

			await page.getByTestId("dropdown-menu-trigger").click();

			const panel = page.getByTestId("dropdown-menu-panel");
			const light = await getPanelColours(panel);

			expect(light.backgroundColor).toBe(light.surfaceElevated);
			expect(light.borderColor).toBe(light.border);

			await mounted.evaluate((element) => element.classList.add("dark"));

			const dark = await getPanelColours(panel);

			expect(dark.backgroundColor).toBe(dark.surfaceElevated);
			expect(dark.borderColor).toBe(dark.border);
			expect(dark.backgroundColor).not.toBe(light.backgroundColor);
			expect(dark.borderColor).not.toBe(light.borderColor);
		});
	});
});

test.describe("narrow viewport", () => {
	test.use({ viewport: { width: 1023, height: 800 } });

	test("opens as a labelled action sheet without menu semantics", async ({ mount, page }) => {
		await mountDropdownMenu(mount);

		const trigger = page.getByTestId("dropdown-menu-trigger");

		await trigger.click();

		const sheet = page.getByTestId("dropdown-menu-sheet");
		const panel = page.getByTestId("dropdown-menu-panel");

		await expect(sheet).toBeVisible();
		await expect(sheet).toHaveAttribute("aria-modal", "true");
		await expect(sheet).toHaveAttribute("aria-label", "Actions");
		await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
		await expect(panel).not.toHaveAttribute("role");
		await expect(page.getByTestId("dropdown-menu-button").first()).not.toHaveAttribute("role");

		const layout = await sheet.evaluate((element) => {
			const styles = getComputedStyle(element);

			return {
				bottom: styles.bottom,
				left: styles.left,
				maxHeight: styles.maxHeight,
				overflowY: styles.overflowY,
				position: styles.position,
				right: styles.right,
			};
		});

		expect(layout).toEqual({
			bottom: "0px",
			left: "0px",
			maxHeight: "720px",
			overflowY: "hidden",
			position: "fixed",
			right: "0px",
		});
	});

	test("uses ordinary sequential focus without menu navigation", async ({ mount, page }) => {
		await mountDropdownMenu(mount);

		await page.getByTestId("dropdown-menu-trigger").click();

		const firstButton = page.getByTestId("dropdown-menu-button").first();
		const secondButton = page.getByTestId("dropdown-menu-button").nth(1);

		await firstButton.focus();
		await expect(firstButton).not.toHaveAttribute("tabindex");

		await page.keyboard.press("ArrowDown");
		await expect(firstButton).toBeFocused();

		await page.keyboard.press("d");
		await expect(firstButton).toBeFocused();

		await page.keyboard.press("Tab");
		await expect(secondButton).toBeFocused();
	});

	test("selection dismisses the sheet and restores focus to the trigger", async ({
		mount,
		page,
	}) => {
		await mountDropdownMenu(mount);

		const trigger = page.getByTestId("dropdown-menu-trigger");

		await trigger.click();
		await page.getByTestId("dropdown-menu-button").first().click();

		await expect(page.getByTestId("dropdown-menu-sheet")).not.toBeVisible();
		await expect(trigger).toBeFocused();
	});

	test("Escape dismisses the sheet and restores focus to the trigger", async ({ mount, page }) => {
		await mountDropdownMenu(mount);

		const trigger = page.getByTestId("dropdown-menu-trigger");

		await trigger.click();
		await page.keyboard.press("Escape");

		await expect(page.getByTestId("dropdown-menu-sheet")).not.toBeVisible();
		await expect(trigger).toBeFocused();
	});

	test("the sheet close button restores focus to the trigger", async ({ mount, page }) => {
		await mountDropdownMenu(mount);

		const trigger = page.getByTestId("dropdown-menu-trigger");

		await trigger.click();
		await page.getByTestId("overlay-sheet-close").click();

		await expect(page.getByTestId("dropdown-menu-sheet")).not.toBeVisible();
		await expect(trigger).toBeFocused();
	});
});

test.describe("desktop viewport", () => {
	test.use({ viewport: { width: 1200, height: 800 } });

	test("retains menu semantics and keyboard navigation", async ({ mount, page }) => {
		await mountDropdownMenu(mount);

		const trigger = page.getByTestId("dropdown-menu-trigger");

		await trigger.click();

		const panel = page.getByTestId("dropdown-menu-panel");
		const firstButton = page.getByTestId("dropdown-menu-button").first();
		const secondButton = page.getByTestId("dropdown-menu-button").nth(1);

		await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
		await expect(panel).toHaveAttribute("role", "menu");
		await expect(firstButton).toHaveAttribute("role", "menuitem");

		await firstButton.focus();
		await page.keyboard.press("ArrowDown");
		await expect(secondButton).toBeFocused();
	});
});

function getPanelColours(panel) {
	return panel.evaluate((element) => {
		const styles = getComputedStyle(element);
		const probe = document.createElement("span");

		probe.style.backgroundColor = "var(--surface-elevated)";
		probe.style.borderTopColor = "var(--border)";
		element.append(probe);

		const probeStyles = getComputedStyle(probe);

		const colours = {
			backgroundColor: styles.backgroundColor,
			border: probeStyles.borderTopColor,
			borderColor: styles.borderTopColor,
			surfaceElevated: probeStyles.backgroundColor,
		};

		probe.remove();

		return colours;
	});
}
