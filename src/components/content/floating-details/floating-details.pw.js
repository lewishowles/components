import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FloatingDetails from "./floating-details.vue";
import FloatingDetailsWithClose from "./floating-details.fixture.vue";

const defaultSlots = { summary: "Summary label", default: "Details content" };
const mountFloatingDetails = createMount(FloatingDetails, { slots: defaultSlots });
const mountWithClose = createMount(FloatingDetailsWithClose);

test.describe("floating-details", () => {
	test("a summary is rendered", async ({ mount, page }) => {
		await mountFloatingDetails(mount);

		await expect(page.getByTestId("floating-details")).toBeVisible();
		await expect(page.getByTestId("floating-details")).not.toHaveAttribute("open");
		await expect(page.getByTestId("floating-details-summary")).toBeVisible();
	});

	test.describe("details", () => {
		test("details can be toggled", async ({ mount, page }) => {
			await mountFloatingDetails(mount);

			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details")).toHaveAttribute("open");
			await expect(page.getByTestId("floating-details-content")).toBeVisible();
			await expect(page.getByTestId("floating-details-content")).toHaveClass(/absolute/);

			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details")).not.toHaveAttribute("open");
		});

		test("details can be opened by default", async ({ mount, page }) => {
			await mountFloatingDetails(mount, { open: true });

			await expect(page.getByTestId("floating-details")).toHaveAttribute("open");

			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details")).not.toHaveAttribute("open");
		});
	});

	test.describe("icons", () => {
		test("an icon is shown at the end by default", async ({ mount, page }) => {
			await mountFloatingDetails(mount);

			await expect(page.getByTestId("floating-details-icon-start")).not.toBeAttached();
			await expect(page.getByTestId("floating-details-icon-end")).toBeVisible();
		});

		test("an icon can be placed at the start", async ({ mount, page }) => {
			await mountFloatingDetails(mount, { iconAtStart: true });

			await expect(page.getByTestId("floating-details-icon-start")).toBeVisible();
			await expect(page.getByTestId("floating-details-icon-end")).not.toBeAttached();
		});

		test("the summary icon can be hidden", async ({ mount, page }) => {
			await mountFloatingDetails(mount, { includeIcon: false });

			await expect(page.getByTestId("floating-details-icon-end")).not.toBeAttached();
			await expect(page.getByTestId("floating-details-icon-start")).not.toBeAttached();
		});
	});

	test.describe("slot props", () => {
		test("the close slot prop dismisses the panel", async ({ mount, page }) => {
			await mountWithClose(mount);

			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details")).toHaveAttribute("open");

			await page.getByTestId("close-button").click();
			await expect(page.getByTestId("floating-details")).not.toHaveAttribute("open");
		});
	});

	test.describe("positioning", () => {
		test("opens below the trigger by default", async ({ mount, page }) => {
			await mountFloatingDetails(mount);

			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details-content")).toHaveClass(/top-full/);
		});

		test("flips above when the trigger is near the bottom of the viewport", async ({
			mount,
			page,
		}) => {
			await mountFloatingDetails(mount);

			// margin-top in normal flow pushes the summary to near the viewport
			// bottom, so spaceBelow < panelHeight and the composable flips to above.
			await page.getByTestId("floating-details").evaluate((el) => {
				el.style.marginTop = "calc(100vh - 80px)";
			});

			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details-content")).toHaveClass(/bottom-full/);
		});
	});

	test.describe("interaction", () => {
		test.describe("closeWithEscape", () => {
			test("Escape closes the panel and returns focus to the summary", async ({ mount, page }) => {
				await mountFloatingDetails(mount, {
					slots: {
						default: '<a href="#" data-test="focusable-content">Focusable content</a>',
					},
				});

				await page.getByTestId("floating-details-summary").click();
				await page.getByTestId("focusable-content").click();
				await expect(page.getByTestId("focusable-content")).toBeFocused();

				await page.keyboard.press("Escape");

				await expect(page.getByTestId("floating-details-summary")).toBeFocused();
			});

			test("when closeWithEscape is false, Escape does not close the panel", async ({
				mount,
				page,
			}) => {
				await mountFloatingDetails(mount, {
					props: { closeWithEscape: false },
				});

				await page.getByTestId("floating-details-summary").click();
				await expect(page.getByTestId("floating-details")).toHaveAttribute("open");

				await page.keyboard.press("Escape");

				await expect(page.getByTestId("floating-details")).toHaveAttribute("open");
			});
		});

		test("the panel can be closed by clicking outside", async ({ mount, page }) => {
			await mountFloatingDetails(mount);

			await page.evaluate(() => {
				const element = document.createElement("div");

				element.setAttribute("data-test", "click-target");
				element.textContent = "Click target";
				document.body.appendChild(element);
			});

			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details")).toHaveAttribute("open");

			await page.getByTestId("click-target").click();
			await expect(page.getByTestId("floating-details")).not.toHaveAttribute("open");

			await page.evaluate(() => {
				document.querySelector("[data-test='click-target']")?.remove();
			});
		});
	});
});

test.describe("styling hooks", () => {
	test("data-component is set on the root element", async ({ mount, page }) => {
		await mountFloatingDetails(mount);

		await expect(page.getByTestId("floating-details")).toHaveAttribute(
			"data-component",
			"floating-details",
		);
	});
});
