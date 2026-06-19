import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import AccordionGroupFixture from "./accordion-group.fixture.vue";

const mountAccordionGroup = createMount(AccordionGroupFixture);

test.describe("accordion-group", () => {
	test("a component is rendered", async ({ mount, page }) => {
		await mountAccordionGroup(mount);

		await expect(page.getByTestId("accordion-group")).toBeVisible();
		await expect(page.getByTestId("accordion-panel")).toHaveCount(3);
		await expect(page.getByTestId("accordion-panel").first()).toBeVisible();
	});

	test.describe("accordion-panel accessibility", () => {
		test("panel content has role=region when fewer than 7 panels are present", async ({
			mount,
			page,
		}) => {
			await mountAccordionGroup(mount);

			await expect(
				page.getByTestId("accordion-panel").first().getByTestId("accordion-panel-content"),
			).toHaveAttribute("role", "region");
		});

		test("panel content aria-labelledby matches the title span id", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			const panel = page.getByTestId("accordion-panel").first();
			const titleId = await panel.locator("span[id]").getAttribute("id");

			await expect(panel.getByTestId("accordion-panel-content")).toHaveAttribute(
				"aria-labelledby",
				titleId,
			);
		});

		test('trigger button has data-part="trigger"', async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await expect(
				page.getByTestId("accordion-panel").first().getByTestId("accordion-panel-button"),
			).toHaveAttribute("data-part", "trigger");
		});

		test("trigger button aria-labelledby matches the title span id", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			const panel = page.getByTestId("accordion-panel").first();
			const titleId = await panel.locator("span[id]").getAttribute("id");

			await expect(panel.getByTestId("accordion-panel-button")).toHaveAttribute(
				"aria-labelledby",
				titleId,
			);
		});

		test("panel syncs aria-expanded when beforematch fires on panel content", async ({
			mount,
			page,
		}) => {
			await mountAccordionGroup(mount);

			const panel = page.getByTestId("accordion-panel").first();

			await expect(panel.getByTestId("accordion-panel-button")).toHaveAttribute(
				"aria-expanded",
				"false",
			);

			await panel.getByTestId("accordion-panel-content").evaluate((el) => {
				el.dispatchEvent(new Event("beforematch", { bubbles: true }));
			});

			await expect(panel.getByTestId("accordion-panel-button")).toHaveAttribute(
				"aria-expanded",
				"true",
			);
		});
	});

	test.describe("accordion-panel", () => {
		test("a panel can be opened", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await confirmSectionClosed(page, 0);

			await page
				.getByTestId("accordion-panel")
				.nth(0)
				.getByTestId("accordion-panel-button")
				.click();

			await confirmSectionOpen(page, 0);
		});

		test("a panel can be opened via keyboard", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			const button = page
				.getByTestId("accordion-panel")
				.nth(0)
				.getByTestId("accordion-panel-button");

			await button.focus();
			await button.press("Enter");

			await confirmSectionOpen(page, 0);
		});
	});

	test.describe("accordion-group controls", () => {
		test("Expand all and Collapse all buttons are rendered", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await expect(page.getByTestId("accordion-group-expand-button")).toBeVisible();
			await expect(page.getByTestId("accordion-group-collapse-button")).toBeVisible();
		});

		test("Expand all is aria-disabled when all panels are open", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await page.getByTestId("accordion-group-expand-button").click();

			await confirmSectionOpen(page, 0);
			await confirmSectionOpen(page, 1);
			await confirmSectionOpen(page, 2);

			await expect(page.getByTestId("accordion-group-expand-button")).toHaveAttribute(
				"aria-disabled",
				"true",
			);
		});

		test("Collapse all is aria-disabled when all panels are closed", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await expect(page.getByTestId("accordion-group-collapse-button")).toHaveAttribute(
				"aria-disabled",
				"true",
			);
		});

		test("Expand all opens all panels", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await confirmSectionClosed(page, 0);
			await confirmSectionClosed(page, 1);
			await confirmSectionClosed(page, 2);

			await page.getByTestId("accordion-group-expand-button").click();

			await confirmSectionOpen(page, 0);
			await confirmSectionOpen(page, 1);
			await confirmSectionOpen(page, 2);
		});

		test("Collapse all closes all panels", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await page.getByTestId("accordion-group-expand-button").click();

			await confirmSectionOpen(page, 0);
			await confirmSectionOpen(page, 1);
			await confirmSectionOpen(page, 2);

			await page.getByTestId("accordion-group-collapse-button").click();

			await confirmSectionClosed(page, 0);
			await confirmSectionClosed(page, 1);
			await confirmSectionClosed(page, 2);
		});

		test("closing one panel re-enables Expand all", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await page.getByTestId("accordion-group-expand-button").click();

			await confirmSectionOpen(page, 0);
			await confirmSectionOpen(page, 1);
			await confirmSectionOpen(page, 2);

			await expect(page.getByTestId("accordion-group-expand-button")).toHaveAttribute(
				"aria-disabled",
				"true",
			);

			await page
				.getByTestId("accordion-panel")
				.nth(1)
				.getByTestId("accordion-panel-button")
				.click();

			await confirmSectionClosed(page, 1);

			await expect(page.getByTestId("accordion-group-expand-button")).not.toHaveAttribute(
				"aria-disabled",
			);
		});
	});

	test.describe("keyboard navigation", () => {
		test("ArrowDown moves focus to the next trigger", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await page.getByTestId("accordion-panel-button").nth(0).focus();
			await page.keyboard.press("ArrowDown");

			await expect(page.getByTestId("accordion-panel-button").nth(1)).toBeFocused();
		});

		test("ArrowDown wraps from the last trigger to the first", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await page.getByTestId("accordion-panel-button").nth(2).focus();
			await page.keyboard.press("ArrowDown");

			await expect(page.getByTestId("accordion-panel-button").nth(0)).toBeFocused();
		});

		test("ArrowUp moves focus to the previous trigger", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await page.getByTestId("accordion-panel-button").nth(1).focus();
			await page.keyboard.press("ArrowUp");

			await expect(page.getByTestId("accordion-panel-button").nth(0)).toBeFocused();
		});

		test("Home moves focus to the first trigger", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await page.getByTestId("accordion-panel-button").nth(2).focus();
			await page.keyboard.press("Home");

			await expect(page.getByTestId("accordion-panel-button").nth(0)).toBeFocused();
		});

		test("End moves focus to the last trigger", async ({ mount, page }) => {
			await mountAccordionGroup(mount);

			await page.getByTestId("accordion-panel-button").nth(0).focus();
			await page.keyboard.press("End");

			await expect(page.getByTestId("accordion-panel-button").nth(2)).toBeFocused();
		});
	});
});

async function confirmSectionOpen(page, index) {
	const panel = page.getByTestId("accordion-panel").nth(index);

	await expect(panel.getByTestId("accordion-panel-button")).toHaveAttribute(
		"aria-expanded",
		"true",
	);
	await expect(panel.getByTestId("accordion-panel-content")).toBeVisible();
}

async function confirmSectionClosed(page, index) {
	const panel = page.getByTestId("accordion-panel").nth(index);

	await expect(panel.getByTestId("accordion-panel-button")).toHaveAttribute(
		"aria-expanded",
		"false",
	);
	await expect(panel.getByTestId("accordion-panel-content")).not.toBeVisible();
}
