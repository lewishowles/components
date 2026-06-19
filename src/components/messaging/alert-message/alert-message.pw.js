import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount, slotSvg } from "@lewishowles/testing/playwright";

import AlertMessage from "./alert-message.vue";

// Mount alert-message with sensible defaults for testing.
const mountAlertMessage = createMount(AlertMessage, {
	props: { type: "info" },
	slots: { default: "Alert message" },
});

test.describe("alert-message", () => {
	test("renders an alert-message", async ({ mount, page }) => {
		await mountAlertMessage(mount);

		const alertMessage = page.getByTestId("alert-message");

		await expect(alertMessage).toBeVisible();
		await expect(page.getByTestId("alert-message-title")).not.toBeAttached();
	});

	test("a title can be shown", async ({ mount, page }) => {
		await mountAlertMessage(mount, { slots: { title: "Message title" } });

		await expect(page.getByTestId("alert-message-title")).toBeVisible();
	});

	test("an icon is displayed", async ({ mount, page }) => {
		await mountAlertMessage(mount);

		await expect(page.getByTestId("alert-message-icon")).toBeVisible();
	});

	test("a custom icon can be displayed", async ({ mount, page }) => {
		await mountAlertMessage(mount, { slots: { icon: slotSvg } });

		const alertMessage = page.getByTestId("alert-message");

		await expect(page.getByTestId("alert-message-icon")).not.toBeAttached();
		await expect(alertMessage.locator("svg")).toBeVisible();
	});

	test("a type prefix is shown for typed alerts", async ({ mount, page }) => {
		await mountAlertMessage(mount, { props: { type: "error" } });

		await expect(page.getByTestId("alert-message-type-prefix")).toBeAttached();
	});

	test("no type prefix is shown for muted alerts", async ({ mount, page }) => {
		await mountAlertMessage(mount, { props: { type: "muted" } });

		await expect(page.getByTestId("alert-message-type-prefix")).not.toBeAttached();
	});
});
