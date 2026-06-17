import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import ConditionalWrapper from "./conditional-wrapper.vue";

// Mount conditional-wrapper with sensible defaults for testing.
const mountConditionalWrapper = createMount(ConditionalWrapper, {
	slots: { default: "<div data-test='wrapped-content'>Wrapped content</div>" },
});

test.describe("conditional-wrapper", () => {
	test("a wrapper is rendered", async ({ mount, page }) => {
		await mountConditionalWrapper(mount, { props: { class: "bg-grey-50 p-4" } });

		await expect(page.locator(".bg-grey-50")).toBeVisible();
		await expect(page.getByTestId("wrapped-content")).toBeVisible();
	});

	test("a wrapper can be excluded", async ({ mount, page }) => {
		await mountConditionalWrapper(mount, { props: { wrap: false, class: "bg-grey-50 p-4" } });

		await expect(page.locator(".bg-grey-50")).not.toBeAttached();
		await expect(page.getByTestId("wrapped-content")).toBeVisible();
	});
});
