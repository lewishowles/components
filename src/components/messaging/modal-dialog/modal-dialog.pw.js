import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import ModalDialog from "./modal-dialog.vue";
import InteractionTestFixture from "./modal-dialog.fixture.vue";

// Mount modal-dialog via interaction fixture for open/close flow tests.
const mountInteractionTest = createMount(InteractionTestFixture);

// Mount modal-dialog directly with initiallyOpen for accessibility attribute tests.
const mountModalDialog = createMount(ModalDialog, { props: { initiallyOpen: true } });

test.describe("modal-dialog", () => {
	test("renders closed by default", async ({ mount, page }) => {
		await mountInteractionTest(mount);

		await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
	});

	test.describe("Accessibility", () => {
		test("has aria-modal=true", async ({ mount, page }) => {
			await mountModalDialog(mount, { slots: { title: "Dialog title" } });

			await expect(page.getByTestId("modal-dialog")).toHaveAttribute("aria-modal", "true");
		});

		test("has aria-labelledby pointing to the title id when a title is provided", async ({
			mount,
			page,
		}) => {
			await mountModalDialog(mount, { slots: { title: "Dialog title" } });

			const titleId = await page.getByTestId("modal-dialog-title").getAttribute("id");

			await expect(page.getByTestId("modal-dialog")).toHaveAttribute("aria-labelledby", titleId);
		});

		test("uses aria-label when no title is provided", async ({ mount, page }) => {
			await mountModalDialog(mount, { props: { "aria-label": "Primary navigation" } });

			await expect(page.getByRole("dialog", { name: "Primary navigation" })).toBeVisible();
		});

		test("has role=alertdialog when variant is alert", async ({ mount, page }) => {
			await mountModalDialog(mount, {
				props: { variant: "alert" },
				slots: { title: "Alert title" },
			});

			await expect(page.getByTestId("modal-dialog")).toHaveAttribute("role", "alertdialog");
		});

		test("does not override the implicit dialog role by default", async ({ mount, page }) => {
			await mountModalDialog(mount, { slots: { title: "Dialog title" } });

			await expect(page.getByTestId("modal-dialog")).not.toHaveAttribute("role");
		});

		test("automatically wraps content with a description element when variant is alert", async ({
			mount,
			page,
		}) => {
			await mountModalDialog(mount, {
				props: { variant: "alert" },
				slots: { title: "Alert title", default: "This is the alert content" },
			});

			const descriptionId = await page.getByTestId("modal-dialog").getAttribute("aria-describedby");

			await expect(page.locator(`#${descriptionId}`)).toHaveText("This is the alert content");
		});
	});

	test.describe("Interaction", () => {
		test("a dialog can be opened", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();

			await expect(page.getByTestId("modal-dialog")).toBeVisible();
		});

		test("focuses the title without drawing a focus ring", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			const title = page.getByTestId("modal-dialog-title");

			await page.getByTestId("modal-dialog-interaction-test-open").click();

			await expect(title).toBeFocused();
			await expect(title).toHaveCSS("outline-style", "none");
			await expect(title).toHaveCSS("box-shadow", "none");
		});

		test("a dialog can be closed via the close button", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();
			await page.getByTestId("modal-dialog-close").click();

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
		});

		test("a dialog can be closed via escape", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();
			await page.keyboard.press("Escape");

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
		});

		test("a dialog can be closed via a button inside the dialog", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();
			await page.getByTestId("modal-dialog-interaction-test-close").click();

			await expect(page.getByTestId("modal-dialog")).not.toBeVisible();
		});
	});

	test.describe("narrow viewport", () => {
		test.use({ viewport: { width: 1023, height: 800 } });

		test("opens as a bottom sheet", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			await page.getByTestId("modal-dialog-interaction-test-open").click();

			const layout = await page.getByTestId("modal-dialog").evaluate((element) => {
				const styles = getComputedStyle(element);
				const bodyStyles = getComputedStyle(element.querySelector(".modal-dialog-body"));

				return {
					left: styles.left,
					right: styles.right,
					bottom: styles.bottom,
					margin: styles.margin,
					maxHeight: styles.maxHeight,
					overflowY: styles.overflowY,
					bodyOverflowY: bodyStyles.overflowY,
					position: styles.position,
				};
			});

			expect(layout).toEqual({
				left: "0px",
				right: "0px",
				bottom: "0px",
				margin: "0px",
				maxHeight: "720px",
				overflowY: "hidden",
				bodyOverflowY: "auto",
				position: "fixed",
			});
		});

		test("stays in the viewport and prevents background scrolling", async ({ mount, page }) => {
			await mountInteractionTest(mount);

			// The trigger is moved down the page so opening happens after document scroll.
			const openButton = page.getByTestId("modal-dialog-interaction-test-open");
			// The rendered dialog must remain aligned to the viewport after opening.
			const dialog = page.getByTestId("modal-dialog");

			await openButton.evaluate((element) => {
				element.style.marginBlockStart = "150vh";
			});
			await openButton.scrollIntoViewIfNeeded();

			// The regression requires the dialog to open from a scrolled document.
			const initialScrollPosition = await page.evaluate(() => window.scrollY);

			expect(initialScrollPosition).toBeGreaterThan(0);

			await openButton.click();

			await expect
				.poll(() => dialog.evaluate((element) => element.getBoundingClientRect().bottom))
				.toBe(800);
			await expect(page.locator("html")).toHaveCSS("overflow-y", "hidden");
			await expect(page.locator("body")).toHaveCSS("overflow-y", "hidden");

			// The current position must remain stable while the modal is open.
			const lockedScrollPosition = await page.evaluate(() => window.scrollY);

			await page.mouse.wheel(0, -500);

			await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(lockedScrollPosition);
		});
	});
});
