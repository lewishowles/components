import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import FloatingDetails from "./floating-details.vue";
import FloatingDetailsInTable from "./floating-details.fixture.vue";

const defaultSlots = { summary: "Summary label", default: "Details content" };
const mountFloatingDetails = createMount(FloatingDetails, { slots: defaultSlots });
const mountInTable = createMount(FloatingDetailsInTable);

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
			await expect(page.getByTestId("floating-details-content")).toHaveClass(/fixed/);

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
			await mountInTable(mount);

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

			const panel = page.getByTestId("floating-details-content");
			const panelTop = await panel.evaluate((element) => getComputedStyle(element).top);

			expect(panelTop).not.toBe("auto");
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

			const panel = page.getByTestId("floating-details-content");
			const panelBottom = await panel.evaluate((element) => getComputedStyle(element).bottom);

			expect(panelBottom).not.toBe("auto");
		});
	});

	test.describe("scrolling tables", () => {
		test("keeps the panel outside the table scroll height", async ({ mount, page }) => {
			await mountInTable(mount);

			const scrollRegion = page.getByTestId("data-table-scroll-region");

			await scrollRegion.evaluate((element) => {
				element.scrollLeft = element.scrollWidth;
			});
			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details-content")).toBeVisible();

			const scrollSize = await scrollRegion.evaluate((element) => ({
				clientHeight: element.clientHeight,
				scrollHeight: element.scrollHeight,
			}));

			expect(scrollSize.scrollHeight).toBe(scrollSize.clientHeight);
		});

		test("aligns its end edge with the summary trigger", async ({ mount, page }) => {
			await mountInTable(mount);

			const scrollRegion = page.getByTestId("data-table-scroll-region");

			await scrollRegion.evaluate((element) => {
				element.scrollLeft = element.scrollWidth;
			});
			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details-content")).toBeVisible();

			await expect
				.poll(() =>
					page.evaluate(() => {
						const panel = document.querySelector('[data-test="floating-details-content"]');
						const summary = document.querySelector('[data-test="floating-details-summary"]');

						return Math.abs(
							panel.getBoundingClientRect().right - summary.getBoundingClientRect().right,
						);
					}),
				)
				.toBeLessThan(1);
		});

		test("aligns its start edge with the summary trigger in RTL", async ({ mount, page }) => {
			await page.evaluate(() => {
				document.documentElement.dir = "rtl";
			});
			await mountInTable(mount, { align: "start" });

			const scrollRegion = page.getByTestId("data-table-scroll-region");

			await scrollRegion.evaluate((element) => {
				element.scrollLeft = element.scrollWidth;
			});

			await page.getByTestId("floating-details-summary").click();
			await expect(page.getByTestId("floating-details-content")).toBeVisible();

			// A single device-pixel rounding difference is expected here: the RTL
			// coordinate is derived via an extra subtraction (viewport width minus
			// the trigger's right edge) that the LTR case doesn't need.
			await expect
				.poll(() =>
					page.evaluate(() => {
						const panel = document.querySelector('[data-test="floating-details-content"]');
						const summary = document.querySelector('[data-test="floating-details-summary"]');

						return Math.abs(
							panel.getBoundingClientRect().right - summary.getBoundingClientRect().right,
						);
					}),
				)
				.toBeLessThanOrEqual(1);
		});

		test("tracks the summary trigger while the table scrolls", async ({ mount, page }) => {
			await mountInTable(mount);

			const panel = page.getByTestId("floating-details-content");
			const scrollRegion = page.getByTestId("data-table-scroll-region");
			const summary = page.getByTestId("floating-details-summary");

			await summary.click();
			await expect(panel).toBeVisible();
			await scrollRegion.evaluate((element) => {
				element.scrollLeft = element.scrollWidth;
			});

			await expect
				.poll(() =>
					page.evaluate(() => {
						const panel = document.querySelector('[data-test="floating-details-content"]');
						const summary = document.querySelector('[data-test="floating-details-summary"]');

						return Math.min(
							Math.abs(panel.getBoundingClientRect().left - summary.getBoundingClientRect().left),
							Math.abs(panel.getBoundingClientRect().right - summary.getBoundingClientRect().right),
						);
					}),
				)
				.toBeLessThan(1);
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

test.describe("narrow viewport", () => {
	test.use({ viewport: { width: 1023, height: 800 } });

	test("opens as a labelled bottom sheet", async ({ mount, page }) => {
		await mountFloatingDetails(mount);

		await page.getByTestId("floating-details-summary").click();

		const sheet = page.getByTestId("floating-details-sheet");

		await expect(sheet).toBeVisible();
		await expect(sheet).toHaveAttribute("aria-modal", "true");
		await expect(sheet).toHaveAttribute("aria-label", "Summary label");

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

	test("scrolls tall content inside the sheet before the page", async ({ mount, page }) => {
		await mountFloatingDetails(mount, {
			slots: {
				default: '<div style="height: 1200px">Tall details content</div>',
			},
		});

		await page.getByTestId("floating-details-summary").click();

		const sheet = page.getByTestId("floating-details-sheet");
		const body = sheet.locator(".modal-dialog-body");

		await body.hover();
		await page.mouse.wheel(0, 500);
		await expect.poll(() => body.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
		expect(await page.evaluate(() => window.scrollY)).toBe(0);
	});

	test("dismisses with Escape and restores focus to the summary", async ({ mount, page }) => {
		await mountFloatingDetails(mount);

		const summary = page.getByTestId("floating-details-summary");
		const sheet = page.getByTestId("floating-details-sheet");

		await summary.click();
		await expect(sheet).toBeVisible();
		await page.keyboard.press("Escape");

		await expect(sheet).not.toBeVisible();
		await expect(summary).toBeFocused();
	});

	test("ignores backdrop clicks and dismisses from its close button", async ({ mount, page }) => {
		await mountFloatingDetails(mount);

		const details = page.getByTestId("floating-details");
		const summary = page.getByTestId("floating-details-summary");
		const sheet = page.getByTestId("floating-details-sheet");
		const closeButton = page.getByRole("button", { name: "Close dialog" });

		await summary.click();
		await expect(sheet).toBeVisible();
		await page.mouse.click(1, 1);

		await expect(sheet).toBeVisible();
		await expect(details).toHaveAttribute("open");
		await expect(closeButton).toBeVisible();

		await closeButton.click();

		await expect(sheet).not.toBeVisible();
		await expect(details).not.toHaveAttribute("open");
		await expect(summary).toBeFocused();
	});

	test("dismisses when a link is activated", async ({ mount, page }) => {
		await mountFloatingDetails(mount, {
			slots: {
				default: '<a href="#" data-test="sheet-link">Visit account</a>',
			},
		});

		const summary = page.getByTestId("floating-details-summary");
		const sheet = page.getByTestId("floating-details-sheet");

		await summary.click();
		await page.getByTestId("sheet-link").click();

		await expect(sheet).not.toBeVisible();
		await expect(summary).toBeFocused();
	});

	test("keeps one live content tree when the viewport crosses the breakpoint", async ({
		mount,
		page,
	}) => {
		await mountFloatingDetails(mount, {
			slots: {
				default: '<label>Value <input data-test="stateful-input" /></label>',
			},
		});

		await page.getByTestId("floating-details-summary").click();
		await page.getByTestId("stateful-input").fill("preserved");
		await expect(page.getByTestId("stateful-input")).toHaveCount(1);

		await page.setViewportSize({ width: 1200, height: 800 });
		await expect(page.getByTestId("floating-details-content")).toBeVisible();
		await expect(page.getByTestId("stateful-input")).toHaveValue("preserved");
		await expect(page.getByTestId("stateful-input")).toHaveCount(1);

		await page.setViewportSize({ width: 1023, height: 800 });
		await expect(page.getByTestId("floating-details-sheet")).toBeVisible();
		await expect(page.getByTestId("stateful-input")).toHaveValue("preserved");
		await expect(page.getByTestId("stateful-input")).toHaveCount(1);
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
