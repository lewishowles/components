import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "#test/ct/support/mount.js";

import FlashMessagesCustomSlotFixture from "./flash-messages-custom-slot.fixture.vue";
import FlashMessagesFixture from "./flash-messages.fixture.vue";

// Mount the fixture so messages can be sent before flash-messages renders.
const mountFlashMessages = createMount(FlashMessagesFixture);

// Mount the custom-slot fixture for scoped slot rendering tests.
const mountFlashMessagesCustomSlot = createMount(FlashMessagesCustomSlotFixture);

test.describe("flash-messages", () => {
	test("global messages are shown by default", async ({ mount, page }) => {
		await mountFlashMessages(mount);

		const alertMessage = page.getByTestId("alert-message");

		await expect(alertMessage).toBeVisible();
		await expect(page.getByTestId("alert-message-title")).toHaveText("Alert approved");
		await expect(alertMessage).toContainText("The alert has been approved.");
		await expect(alertMessage).toHaveCount(1);
	});

	test("namespaced messages are shown when the namespace matches", async ({ mount, page }) => {
		await mountFlashMessages(mount, { namespace: "user-alert" });

		const alertMessage = page.getByTestId("alert-message");

		await expect(alertMessage).toBeVisible();
		await expect(page.getByTestId("alert-message-title")).toHaveText("Alert approved");
		await expect(alertMessage).toContainText("The alert has been approved.");
		await expect(alertMessage).toHaveCount(1);
	});

	test("messages can be displayed with custom content", async ({ mount, page }) => {
		await mountFlashMessagesCustomSlot(mount);

		await expect(page.getByTestId("custom-flash-message")).toHaveText(
			"Alert approved: The alert has been approved.",
		);
		await expect(page.getByTestId("alert-message")).not.toBeAttached();
	});
});
