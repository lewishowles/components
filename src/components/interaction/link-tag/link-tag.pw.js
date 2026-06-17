import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import LinkTag from "./link-tag.vue";

// Mount link-tag with sensible defaults for testing.
const mountLinkTag = createMount(LinkTag, {
	props: { href: "https://howles.dev" },
	slots: { default: "howles.dev" },
});

test.describe("link-tag", () => {
	test("a link is rendered", async ({ mount, page }) => {
		await mountLinkTag(mount);

		await expect(page.getByTestId("link-tag")).toHaveText("howles.dev");
	});

	test("an icon can be added to the start", async ({ mount, page }) => {
		await mountLinkTag(mount, { iconStart: "icon-chevron-left" });

		await expect(page.getByTestId("link-tag-icon-start")).toBeVisible();
		await expect(page.getByTestId("link-tag-icon-end")).not.toBeAttached();
	});

	test("an icon can be added to the end", async ({ mount, page }) => {
		await mountLinkTag(mount, { iconEnd: "icon-chevron-right" });

		await expect(page.getByTestId("link-tag-icon-start")).not.toBeAttached();
		await expect(page.getByTestId("link-tag-icon-end")).toBeVisible();
	});

	test.describe("external", () => {
		test("an external link can be defined", async ({ mount, page }) => {
			await mountLinkTag(mount, { external: true });

			await expect(page.getByTestId("link-tag-icon-start")).not.toBeAttached();
			await expect(page.getByTestId("link-tag-icon-end")).not.toBeAttached();
			await expect(page.getByTestId("link-tag-icon-external")).toBeVisible();
		});

		test("an external link icon overrides an end icon", async ({ mount, page }) => {
			await mountLinkTag(mount, { external: true, iconEnd: "icon-chevron-right" });

			await expect(page.getByTestId("link-tag-icon-start")).not.toBeAttached();
			await expect(page.getByTestId("link-tag-icon-end")).not.toBeAttached();
			await expect(page.getByTestId("link-tag-icon-external")).toBeVisible();
		});

		test("an external link icon can be hidden", async ({ mount, page }) => {
			await mountLinkTag(mount, {
				external: true,
				iconEnd: "icon-chevron-right",
				showExternalIcon: false,
			});

			await expect(page.getByTestId("link-tag-icon-start")).not.toBeAttached();
			await expect(page.getByTestId("link-tag-icon-end")).toBeVisible();
			await expect(page.getByTestId("link-tag-icon-external")).not.toBeAttached();
		});
	});

	test.describe("styling hooks", () => {
		test("data-component is set on the root element", async ({ mount, page }) => {
			await mountLinkTag(mount);

			await expect(page.getByTestId("link-tag")).toHaveAttribute("data-component", "link-tag");
		});

		test("data-external is set when external is true", async ({ mount, page }) => {
			await mountLinkTag(mount, { external: true });

			await expect(page.getByTestId("link-tag")).toHaveAttribute("data-external");
		});

		test("data-external is not set for a standard link", async ({ mount, page }) => {
			await mountLinkTag(mount);

			await expect(page.getByTestId("link-tag")).not.toHaveAttribute("data-external");
		});
	});
});
