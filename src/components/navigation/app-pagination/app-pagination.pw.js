import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import AppPagination from "./app-pagination.vue";

// Mount app-pagination with sensible defaults for testing.
const mountAppPagination = createMount(AppPagination, { props: { count: 100 } });

test.describe("app-pagination", () => {
	test("renders a app-pagination", async ({ mount, page }) => {
		await mountAppPagination(mount);

		await expect(page.getByTestId("app-pagination")).toBeVisible();
	});
});
