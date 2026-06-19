import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import NotificationHandlerDangerMarkReadFixture from "./notification-handler-danger-mark-read.fixture.vue";
import NotificationHandlerFixture from "./notification-handler.fixture.vue";
import NotificationHandlerInfoMarkReadFixture from "./notification-handler-info-mark-read.fixture.vue";
import NotificationHandlerViewMoreLabelFixture from "./notification-handler-view-more-label.fixture.vue";
import NotificationHandlerWarningMarkReadFixture from "./notification-handler-warning-mark-read.fixture.vue";

// A long message that exercises text display in notification components.
const notificationMessage =
	"Mollit esse mollit aute id adipisicing. Do reprehenderit consequat non amet eu aliqua consequat do labore cupidatat sit sint elit pariatur.";

const mountHandler = createMount(NotificationHandlerFixture);
const mountWithInfoMarkRead = createMount(NotificationHandlerInfoMarkReadFixture);
const mountWithWarningMarkRead = createMount(NotificationHandlerWarningMarkReadFixture);
const mountWithDangerMarkRead = createMount(NotificationHandlerDangerMarkReadFixture);
const mountWithViewMoreLabel = createMount(NotificationHandlerViewMoreLabelFixture);

test.describe("notification-handler", () => {
	test("a component is rendered", async ({ mount, page }) => {
		await mountHandler(mount);

		await expect(page.getByTestId("notification-handler")).toBeVisible();
	});

	test.describe("interaction", () => {
		test("the user can open and close the notification panel", async ({ mount, page }) => {
			await mountHandler(mount);

			await openPanel(page);
			await closePanel(page);
		});
	});

	test.describe("display", () => {
		test("read notifications can be displayed", async ({ mount, page }) => {
			await mountHandler(mount, {
				props: { notifications: generateNotifications(5, { read: true }) },
			});

			await expect(page.getByTestId("notification-handler-badge")).not.toBeAttached();

			await openPanel(page);

			await expect(page.getByTestId("notification-read")).toHaveCount(5);
		});

		test("unread notifications can be displayed", async ({ mount, page }) => {
			await mountHandler(mount, {
				props: { notifications: generateNotifications(5, { read: false }) },
			});

			await expect(page.getByTestId("notification-handler-badge")).toBeVisible();
			await expect(page.getByTestId("notification-handler-badge")).toHaveText("5");

			await openPanel(page);

			await expect(page.getByTestId("notification-info")).toHaveCount(5);
		});

		test("mixed notifications can be displayed", async ({ mount, page }) => {
			await mountHandler(mount, {
				props: {
					notifications: [
						...generateNotifications(3, { read: false }),
						...generateNotifications(2, { read: true }),
					],
				},
			});

			await expect(page.getByTestId("notification-handler-badge")).toBeVisible();
			await expect(page.getByTestId("notification-handler-badge")).toHaveText("3");

			await openPanel(page);

			await expect(page.getByTestId("notification-info")).toHaveCount(3);
			await expect(page.getByTestId("notification-read")).toHaveCount(2);
		});

		test.describe("slots", () => {
			test.describe("notification-read-template", () => {
				test("the notification-read-template slot can be implemented", async ({ mount, page }) => {
					await mountHandler(mount, {
						props: { notifications: generateNotifications(1, { read: true }) },
						slots: { "notification-read-template": "<span>Custom read content</span>" },
					});

					await openPanel(page);

					await expect(page.getByTestId("notification-handler-notifications")).toContainText(
						"Custom read content",
					);
				});
			});

			test.describe("notification-info-template", () => {
				test("the notification-info-template slot can be implemented", async ({ mount, page }) => {
					await mountHandler(mount, {
						props: { notifications: generateNotifications(1, { read: false }) },
						slots: { "notification-info-template": "<span>Custom info content</span>" },
					});

					await openPanel(page);

					await expect(page.getByTestId("notification-handler-notifications")).toContainText(
						"Custom info content",
					);
				});

				test("the markNotificationRead slot prop marks the notification as read", async ({
					mount,
					page,
				}) => {
					await mountWithInfoMarkRead(mount, {
						props: { notifications: [{ id: "notification-1", message: "Notification sample" }] },
					});

					await openPanel(page);

					await page.getByTestId("notification-info-custom-mark-read").click();

					await expect(page.getByTestId("notification-info")).not.toBeAttached();
					await expect(page.getByTestId("notification-read")).toBeVisible();
				});
			});

			test.describe("notification-warning-template", () => {
				test("the notification-warning-template slot can be implemented", async ({
					mount,
					page,
				}) => {
					await mountHandler(mount, {
						props: { notifications: generateNotifications(1, { type: "warning" }) },
						slots: { "notification-warning-template": "<span>Custom warning content</span>" },
					});

					await openPanel(page);

					await expect(page.getByTestId("notification-handler-notifications")).toContainText(
						"Custom warning content",
					);
				});

				test("the markNotificationRead slot prop marks the notification as read", async ({
					mount,
					page,
				}) => {
					await mountWithWarningMarkRead(mount, {
						props: {
							notifications: [
								{ id: "notification-1", message: "Notification sample", type: "warning" },
							],
						},
					});

					await openPanel(page);

					await page.getByTestId("notification-warning-custom-mark-read").click();

					await expect(page.getByTestId("notification-warning")).not.toBeAttached();
					await expect(page.getByTestId("notification-read")).toBeVisible();
				});
			});

			test.describe("notification-danger-template", () => {
				test("the notification-danger-template slot can be implemented", async ({
					mount,
					page,
				}) => {
					await mountHandler(mount, {
						props: { notifications: generateNotifications(1, { type: "danger" }) },
						slots: { "notification-danger-template": "<span>Custom danger content</span>" },
					});

					await openPanel(page);

					await expect(page.getByTestId("notification-handler-notifications")).toContainText(
						"Custom danger content",
					);
				});

				test("the markNotificationRead slot prop marks the notification as read", async ({
					mount,
					page,
				}) => {
					await mountWithDangerMarkRead(mount, {
						props: {
							notifications: [
								{ id: "notification-1", message: "Notification sample", type: "danger" },
							],
						},
					});

					await openPanel(page);

					await page.getByTestId("notification-danger-custom-mark-read").click();

					await expect(page.getByTestId("notification-danger")).not.toBeAttached();
					await expect(page.getByTestId("notification-read")).toBeVisible();
				});
			});

			test.describe("notification-pinned-template", () => {
				test("the notification-pinned-template slot can be implemented", async ({
					mount,
					page,
				}) => {
					await mountHandler(mount, {
						props: { notifications: generateNotifications(1, { pinned: true }) },
						slots: { "notification-pinned-template": "<span>Custom pinned content</span>" },
					});

					await openPanel(page);

					await expect(page.getByTestId("notification-handler-notifications")).toContainText(
						"Custom pinned content",
					);
				});
			});

			test("the view-more-label slot can be implemented", async ({ mount, page }) => {
				await mountWithViewMoreLabel(mount, {
					props: { notifications: generateNotifications(1, { url: "https://example.com" }) },
				});

				await openPanel(page);

				await expect(page.getByTestId("notification-info-view-more")).toContainText(
					"View something",
				);
			});

			test("the notification-actions slot can be implemented", async ({ mount, page }) => {
				await mountHandler(mount, {
					props: { notifications: generateNotifications(1) },
					slots: { "notification-actions": "Additional actions" },
				});

				await openPanel(page);

				await expect(page.getByTestId("notification-info-actions")).toContainText(
					"Additional actions",
				);
			});
		});

		test.describe("toolbar", () => {
			test("the toolbar is not visible when reload and mark all read are both disabled", async ({
				mount,
				page,
			}) => {
				await mountHandler(mount, {
					props: {
						notifications: generateNotifications(1),
						allowMarkAllRead: false,
						allowReload: false,
					},
				});

				await expect(page.getByTestId("notification-handler-toolbar")).not.toBeAttached();
			});
		});
	});

	test.describe("interaction", () => {
		test("a notification can be marked as read", async ({ mount, page }) => {
			await mountHandler(mount, {
				props: { notifications: [{ id: "notification-1", message: "Notification sample" }] },
			});

			await openPanel(page);

			await expect(page.getByTestId("notification-read")).not.toBeAttached();
			await page.getByTestId("notification-info-mark-read").click();

			await expect(page.getByTestId("notification-info")).not.toBeAttached();
			await expect(page.getByTestId("notification-read")).toBeVisible();
		});

		test("a read notification cannot be marked as read", async ({ mount, page }) => {
			await mountHandler(mount, {
				props: {
					notifications: [{ id: "notification-1", message: "Notification sample", read: true }],
				},
			});

			await openPanel(page);

			await expect(page.getByTestId("notification-info")).not.toBeAttached();
			await expect(page.getByTestId("notification-read")).toBeVisible();
			await expect(page.getByTestId("notification-read-mark-read")).not.toBeAttached();
		});

		test.describe("reload notifications", () => {
			test("a reload request can be sent", async ({ mount, page }) => {
				await mountHandler(mount, { props: { notifications: generateNotifications(5) } });

				await openPanel(page);
				await page.getByTestId("notification-handler-reload").click();

				await expect(page.getByTestId("notification-handler-reload-count")).toHaveAttribute(
					"data-count",
					"1",
				);
			});

			test("allowReload controls the visibility of the reload button", async ({ mount, page }) => {
				await mountHandler(mount, {
					props: {
						notifications: generateNotifications(5),
						allowReload: false,
					},
				});

				await expect(page.getByTestId("notification-handler-reload")).not.toBeAttached();
			});
		});

		test.describe("mark all read", () => {
			test("all notifications can be marked as read", async ({ mount, page }) => {
				await mountHandler(mount, {
					props: {
						notifications: [
							{ id: "notification-1", message: "Notification sample" },
							{ id: "notification-2", message: "Notification sample" },
							{ id: "notification-3", message: "Notification sample" },
						],
					},
				});

				await openPanel(page);

				await expect(page.getByTestId("notification-read")).not.toBeAttached();
				await expect(page.getByTestId("notification-info")).toHaveCount(3);

				await page.getByTestId("notification-handler-mark-all-read").click();

				await expect(page.getByTestId("notification-info")).not.toBeAttached();
				await expect(page.getByTestId("notification-read")).toHaveCount(3);
			});

			test("allowMarkAllRead controls the visibility of the mark all read button", async ({
				mount,
				page,
			}) => {
				await mountHandler(mount, {
					props: {
						notifications: generateNotifications(5, { read: false }),
						allowMarkAllRead: false,
					},
				});

				await expect(page.getByTestId("notification-handler-mark-all-read")).not.toBeAttached();
			});

			test("mark all read is only available when there are unread notifications", async ({
				mount,
				page,
			}) => {
				await mountHandler(mount, {
					props: { notifications: generateNotifications(5, { read: true }) },
				});

				await expect(page.getByTestId("notification-handler-mark-all-read")).not.toBeAttached();
			});
		});
	});
});

test.describe("styling hooks", () => {
	test("data-component is set on the root element", async ({ mount, page }) => {
		await mountHandler(mount);

		await expect(page.getByTestId("notification-handler")).toHaveAttribute(
			"data-component",
			"notification-handler",
		);
	});
});

/**
 * Open the notification panel, asserting it transitions to the open state.
 *
 * @param  {object}  page
 *     The Playwright page object.
 */
async function openPanel(page) {
	await expect(page.getByTestId("notification-handler")).not.toHaveAttribute("open");
	await page.getByTestId("notification-handler-summary").click();
	await expect(page.getByTestId("notification-handler")).toHaveAttribute("open");
	await expect(page.getByTestId("notification-handler-content")).toBeVisible();
}

/**
 * Close the notification panel, asserting it transitions to the closed state.
 *
 * @param  {object}  page
 *     The Playwright page object.
 */
async function closePanel(page) {
	await expect(page.getByTestId("notification-handler")).toHaveAttribute("open");
	await page.getByTestId("notification-handler-summary").click();
	await expect(page.getByTestId("notification-handler")).not.toHaveAttribute("open");
}

/**
 * Generate a set of test notifications with optional overrides.
 *
 * @param  {number}  count
 *     The number of notifications to generate.
 * @param  {object}  overrides
 *     Any properties to override on each generated notification.
 */
function generateNotifications(count, overrides = {}) {
	return Array.from({ length: count }, () => generateNotification(overrides));
}

/**
 * Generate a single test notification with optional overrides.
 *
 * @param  {object}  overrides
 *     Any properties to override on the generated notification.
 */
function generateNotification(overrides = {}) {
	return {
		id: Math.random().toString(36).slice(2),
		message: notificationMessage,
		...overrides,
	};
}
