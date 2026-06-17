import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import CopyContent from "./copy-content.vue";

// Mount copy-content with sensible defaults for testing.
const mountCopyContent = createMount(CopyContent);

test.describe("copy-content", () => {
	test("renders a copy-content", async ({ mount, page }) => {
		await mountCopyContent(mount);

		await expect(page.getByTestId("copy-content")).toBeVisible();
	});

	test.describe("Interaction", () => {
		test("copies content to clipboard and shows success message", async ({ mount, page }) => {
			await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
			await mountCopyContent(mount, { props: { content: "Test content" } });

			await page.getByTestId("copy-content").click();

			const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

			expect(clipboardText).toBe("Test content");
			await expect(page.getByTestId("copy-content-success")).toBeVisible();
			await expect(page.getByTestId("copy-content-label")).toHaveClass(/opacity-0/);
		});

		test("shows error message when no content is provided", async ({ mount, page }) => {
			await mountCopyContent(mount, { props: { content: "" } });

			await page.getByTestId("copy-content").click();

			await expect(page.getByTestId("copy-content-error")).toBeVisible();
		});
	});

	test.describe("Styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountCopyContent(mount);

			await expect(page.getByTestId("copy-content")).toHaveAttribute(
				"data-component",
				"copy-content",
			);
		});

		test("data-part is set on the label", async ({ mount, page }) => {
			await mountCopyContent(mount);

			await expect(page.getByTestId("copy-content-label")).toHaveAttribute("data-part", "label");
		});

		test("data-copied is set when the copy succeeds", async ({ mount, page }) => {
			await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
			await mountCopyContent(mount, { props: { content: "Test content" } });

			await page.getByTestId("copy-content").click();

			await expect(page.getByTestId("copy-content")).toHaveAttribute("data-copied", "true");
		});

		test("data-copied is not set by default", async ({ mount, page }) => {
			await mountCopyContent(mount);

			await expect(page.getByTestId("copy-content")).not.toHaveAttribute("data-copied");
		});
	});
});
