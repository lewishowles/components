import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import ImageTag from "./image-tag.vue";

// Mount image-tag with sensible defaults for testing.
const mountImageTag = createMount(ImageTag, { props: { src: "https://picsum.photos/300/300" } });

test.describe("image-tag", () => {
	test("renders an image-tag", async ({ mount, page }) => {
		await mountImageTag(mount);

		await expect(page.getByTestId("image-tag")).toBeVisible();
	});

	test("a fallback is rendered for an invalid image", async ({ mount, page }) => {
		await mountImageTag(mount, { props: { src: "/abcd" } });

		await expect(page.getByTestId("image-tag-fallback")).toBeVisible();
	});
});
