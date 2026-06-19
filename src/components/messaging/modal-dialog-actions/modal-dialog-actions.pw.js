import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import ModalDialogActions from "./modal-dialog-actions.vue";

// Mount modal-dialog-actions with sensible defaults for testing.
const mountModalDialogActions = createMount(ModalDialogActions);

test.describe("modal-dialog-actions", () => {
	test("renders a modal-dialog-actions", async ({ mount, page }) => {
		await mountModalDialogActions(mount);

		await expect(page.getByTestId("modal-dialog-actions")).toBeAttached();
	});
});
