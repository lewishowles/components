import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import SummaryDetails from "./summary-details.vue";

const defaultSlots = { summary: "Summary label", default: "Details content" };
const mountSummaryDetails = createMount(SummaryDetails, { slots: defaultSlots });

test.describe("summary-details", () => {
	test("a summary is rendered", async ({ mount, page }) => {
		await mountSummaryDetails(mount);

		await expect(page.getByTestId("summary-details")).toBeVisible();
		await expect(page.getByTestId("summary-details")).not.toHaveAttribute("open");
		await expect(page.getByTestId("summary-details-summary")).toBeVisible();
	});

	test.describe("details", () => {
		test("details can be toggled", async ({ mount, page }) => {
			await mountSummaryDetails(mount);

			await page.getByTestId("summary-details-summary").click();
			await expect(page.getByTestId("summary-details")).toHaveAttribute("open");

			await page.getByTestId("summary-details-summary").click();
			await expect(page.getByTestId("summary-details")).not.toHaveAttribute("open");
		});

		test("details can be opened by default", async ({ mount, page }) => {
			await mountSummaryDetails(mount, { open: true });

			await expect(page.getByTestId("summary-details")).toHaveAttribute("open");

			await page.getByTestId("summary-details-summary").click();
			await expect(page.getByTestId("summary-details")).not.toHaveAttribute("open");
		});

		test("details can float", async ({ mount, page }) => {
			await mountSummaryDetails(mount, { floating: true });

			await page.getByTestId("summary-details-summary").click();

			await expect(page.getByTestId("summary-details-content")).toBeVisible();
			await expect(page.getByTestId("summary-details-content")).toHaveClass(/absolute/);
		});
	});

	test.describe("icons", () => {
		test("an icon is shown at the end by default", async ({ mount, page }) => {
			await mountSummaryDetails(mount);

			await expect(page.getByTestId("summary-details-icon-start")).not.toBeAttached();
			await expect(page.getByTestId("summary-details-icon-end")).toBeVisible();
		});

		test("an icon can be placed at the start", async ({ mount, page }) => {
			await mountSummaryDetails(mount, { iconAtStart: true });

			await expect(page.getByTestId("summary-details-icon-start")).toBeVisible();
			await expect(page.getByTestId("summary-details-icon-end")).not.toBeAttached();
		});

		test("the summary icon can be hidden", async ({ mount, page }) => {
			await mountSummaryDetails(mount, { includeIcon: false });

			await expect(page.getByTestId("summary-details-icon-end")).not.toBeAttached();
			await expect(page.getByTestId("summary-details-icon-start")).not.toBeAttached();
		});
	});

	test.describe("autofocus", () => {
		test("focuses the first focusable element when opened with autofocus enabled", async ({
			mount,
			page,
		}) => {
			await mountSummaryDetails(mount, {
				props: { autofocus: true },
				slots: { default: '<button data-test="first-focusable">Action</button>' },
			});

			await page.getByTestId("summary-details-summary").click();

			await expect(page.getByTestId("first-focusable")).toBeFocused();
		});

		test("does not move focus when opened without autofocus", async ({ mount, page }) => {
			await mountSummaryDetails(mount, {
				props: { autofocus: false },
				slots: { default: '<button data-test="first-focusable">Action</button>' },
			});

			await page.getByTestId("summary-details-summary").click();

			await expect(page.getByTestId("first-focusable")).not.toBeFocused();
		});
	});

	test.describe("interaction", () => {
		test.describe("closeWithEscape", () => {
			test("Escape closes the panel and returns focus to the summary", async ({ mount, page }) => {
				await mountSummaryDetails(mount, {
					slots: {
						default: '<a href="#" data-test="focusable-content">Focusable content</a>',
					},
				});

				await page.getByTestId("summary-details-summary").click();
				await page.getByTestId("focusable-content").focus();

				await page.keyboard.press("Escape");

				await expect(page.getByTestId("summary-details-summary")).toBeFocused();
			});

			test("when closeWithEscape is false, Escape does not close the panel", async ({
				mount,
				page,
			}) => {
				await mountSummaryDetails(mount, { closeWithEscape: false });

				await page.getByTestId("summary-details-summary").click();
				await expect(page.getByTestId("summary-details")).toHaveAttribute("open");

				await page.keyboard.press("Escape");

				await expect(page.getByTestId("summary-details")).toHaveAttribute("open");
			});
		});

		test.describe("closeWithClickOutside", () => {
			test("clicking outside closes the panel", async ({ mount, page }) => {
				await mountSummaryDetails(mount, { closeWithClickOutside: true });

				await page.evaluate(() => {
					const element = document.createElement("div");

					element.setAttribute("data-test", "click-target");
					element.textContent = "Click target";
					document.body.appendChild(element);
				});

				await page.getByTestId("summary-details-summary").click();
				await expect(page.getByTestId("summary-details")).toHaveAttribute("open");

				await page.getByTestId("click-target").click();
				await expect(page.getByTestId("summary-details")).not.toHaveAttribute("open");

				await page.evaluate(() => {
					document.querySelector("[data-test='click-target']")?.remove();
				});
			});

			test("when closeWithClickOutside is false, clicking outside does not close the panel", async ({
				mount,
				page,
			}) => {
				await mountSummaryDetails(mount, { closeWithClickOutside: false });

				await page.evaluate(() => {
					const element = document.createElement("div");

					element.setAttribute("data-test", "click-target");
					element.textContent = "Click target";
					document.body.appendChild(element);
				});

				await page.getByTestId("summary-details-summary").click();
				await expect(page.getByTestId("summary-details")).toHaveAttribute("open");

				await page.getByTestId("click-target").click();
				await expect(page.getByTestId("summary-details")).toHaveAttribute("open");

				await page.evaluate(() => {
					document.querySelector("[data-test='click-target']")?.remove();
				});
			});
		});
	});

	test.describe("find-in-page support", () => {
		test('content has hidden="until-found" when closed', async ({ mount, page }) => {
			await mountSummaryDetails(mount);

			const hidden = await page.getByTestId("summary-details-content").getAttribute("hidden");

			expect(hidden).toBe("until-found");
		});

		test("content does not have hidden attribute when open", async ({ mount, page }) => {
			await mountSummaryDetails(mount, { open: true });

			const hidden = await page.getByTestId("summary-details-content").getAttribute("hidden");

			expect(hidden).toBeNull();
		});

		test("opening details removes the hidden attribute", async ({ mount, page }) => {
			await mountSummaryDetails(mount);

			await page.getByTestId("summary-details-summary").click();

			await expect(page.getByTestId("summary-details-content")).not.toHaveAttribute("hidden");
		});

		test("beforematch event opens the details", async ({ mount, page }) => {
			await mountSummaryDetails(mount);

			await page.getByTestId("summary-details-content").evaluate((el) => {
				el.dispatchEvent(new Event("beforematch", { bubbles: true }));
			});

			await expect(page.getByTestId("summary-details")).toHaveAttribute("open");
		});
	});
});

test.describe("styling hooks", () => {
	test("data-component is set on the root element", async ({ mount, page }) => {
		await mountSummaryDetails(mount);

		await expect(page.getByTestId("summary-details")).toHaveAttribute(
			"data-component",
			"summary-details",
		);
	});

	test("data-state is 'closed' by default", async ({ mount, page }) => {
		await mountSummaryDetails(mount);

		await expect(page.getByTestId("summary-details")).toHaveAttribute("data-state", "closed");
	});

	test("data-state is 'open' when the details are open", async ({ mount, page }) => {
		await mountSummaryDetails(mount, { open: true });

		await expect(page.getByTestId("summary-details")).toHaveAttribute("data-state", "open");
	});
});
