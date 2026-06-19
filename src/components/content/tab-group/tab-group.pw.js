import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import TabGroupFixture from "./tab-group.fixture.vue";
import TabGroupSlotPropsFixture from "./tab-group-slot-props.fixture.vue";

const mountTabGroup = createMount(TabGroupFixture);
const mountTabGroupSlotProps = createMount(TabGroupSlotPropsFixture);

test.describe("tab-group", () => {
	test("a component is rendered", async ({ mount, page }) => {
		await mountTabGroup(mount);

		await expect(page.getByTestId("tab-group")).toBeVisible();
		await expect(page.getByTestId("tab-group-tab")).toHaveCount(3);
	});

	test("renders aria-labelledby when label slot is provided", async ({ mount, page }) => {
		await mountTabGroup(mount, { slots: { label: "Browse documentation sections" } });

		await expect(page.locator('[role="tablist"]')).toHaveAttribute("aria-labelledby");
	});

	test("does not render aria-labelledby when label slot is not provided", async ({
		mount,
		page,
	}) => {
		await mountTabGroup(mount);

		await expect(page.locator('[role="tablist"]')).not.toHaveAttribute("aria-labelledby");
	});

	test("panel root is focusable with tabindex=0", async ({ mount, page }) => {
		await mountTabGroup(mount);

		await expect(
			page.getByTestId("tab-group").locator('[role="tabpanel"]').first(),
		).toHaveAttribute("tabindex", "0");
	});

	test.describe("manual activation", () => {
		test("arrow keys move focus without activating in manual mode", async ({ mount, page }) => {
			await mountTabGroup(mount, { activation: "manual" });

			await assertActiveTab(page, 0);

			await page.getByTestId("tab-group-tab").nth(0).click();
			await page.keyboard.press("ArrowRight");

			await assertFocusedTab(page, 1);
			await assertActiveTab(page, 0);
		});

		test("Enter activates the focused tab in manual mode", async ({ mount, page }) => {
			await mountTabGroup(mount, { activation: "manual" });

			await page.getByTestId("tab-group-tab").nth(0).click();
			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("Enter");

			await assertActiveTab(page, 1);
		});

		test("Space activates the focused tab in manual mode", async ({ mount, page }) => {
			await mountTabGroup(mount, { activation: "manual" });

			await page.getByTestId("tab-group-tab").nth(0).click();
			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("Space");

			await assertActiveTab(page, 1);
		});
	});

	test.describe("interaction", () => {
		test("the active tab should be highlighted", async ({ mount, page }) => {
			await mountTabGroup(mount);

			await assertActiveTab(page, 0);
		});

		test("the active tab can be changed", async ({ mount, page }) => {
			await mountTabGroup(mount);

			await assertActiveTab(page, 0);

			await page.getByTestId("tab-group-tab").nth(1).click();

			await assertActiveTab(page, 1);
		});

		test("keyboard navigation can be utilised", async ({ mount, page }) => {
			await mountTabGroup(mount);

			await assertActiveTab(page, 0);

			await page.getByTestId("tab-group-tab").nth(0).click();

			await page.keyboard.press("ArrowRight");
			await assertActiveTab(page, 1);
			await assertFocusedTab(page, 1);

			await page.keyboard.press("ArrowRight");
			await assertActiveTab(page, 2);
			await assertFocusedTab(page, 2);

			await page.keyboard.press("ArrowLeft");
			await assertActiveTab(page, 1);
			await assertFocusedTab(page, 1);

			await page.keyboard.press("ArrowDown");
			await assertActiveTab(page, 2);
			await assertFocusedTab(page, 2);

			await page.keyboard.press("ArrowDown");
			await assertActiveTab(page, 0);
			await assertFocusedTab(page, 0);

			await page.keyboard.press("ArrowUp");
			await assertActiveTab(page, 2);
			await assertFocusedTab(page, 2);
		});
	});
});

test.describe("slot props", () => {
	test("label slot receives isActive prop", async ({ mount, page }) => {
		await mountTabGroupSlotProps(mount);

		await expect(page.locator('[data-test="tab-label"]').nth(0)).toHaveAttribute(
			"data-active",
			"true",
		);
		await expect(page.locator('[data-test="tab-label"]').nth(1)).toHaveAttribute(
			"data-active",
			"false",
		);
	});

	test("panel slot receives isActive prop", async ({ mount, page }) => {
		await mountTabGroupSlotProps(mount);

		await expect(page.locator('[data-test="panel-content"]').nth(0)).toHaveAttribute(
			"data-active",
			"true",
		);
		await expect(page.locator('[data-test="panel-content"]').nth(1)).toHaveAttribute(
			"data-active",
			"false",
		);
	});
});

test.describe("styling hooks", () => {
	test("data-component is set on the root element", async ({ mount, page }) => {
		await mountTabGroup(mount);

		await expect(page.getByTestId("tab-group")).toHaveAttribute("data-component", "tab-group");
	});
});

async function assertActiveTab(page, index, tabCount = 3) {
	for (let i = 0; i < tabCount; i++) {
		await expect(page.getByTestId("tab-group-tab").nth(i)).toHaveAttribute(
			"aria-selected",
			i === index ? "true" : "false",
		);
	}
}

async function assertFocusedTab(page, index) {
	await expect(page.getByTestId("tab-group-tab").nth(index)).toBeFocused();
}
