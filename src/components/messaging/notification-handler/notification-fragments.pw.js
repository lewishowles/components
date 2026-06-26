import { expect, test } from "@playwright/experimental-ct-vue";
import { createMount } from "@lewishowles/testing/playwright";

import NotificationBase from "./fragments/notification-base/notification-base.vue";
import NotificationBaseEmitFixture from "./notification-base-emit.fixture.vue";
import NotificationDanger from "./fragments/notification-danger/notification-danger.vue";
import NotificationInfo from "./fragments/notification-info/notification-info.vue";
import NotificationPinned from "./fragments/notification-pinned/notification-pinned.vue";
import NotificationRead from "./fragments/notification-read/notification-read.vue";
import NotificationWarning from "./fragments/notification-warning/notification-warning.vue";

const notificationMessage =
	"Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";

const notification = { id: "notification-1", message: notificationMessage };

/** @type {{ component: object, name: string, showBadge: boolean, showStripe: boolean }[]} */
const notificationFragments = [
	{ component: NotificationBase, name: "notification-base", showBadge: true, showStripe: true },
	{ component: NotificationDanger, name: "notification-danger", showBadge: true, showStripe: true },
	{ component: NotificationInfo, name: "notification-info", showBadge: true, showStripe: true },
	{ component: NotificationPinned, name: "notification-pinned", showBadge: true, showStripe: true },
	{ component: NotificationRead, name: "notification-read", showBadge: false, showStripe: false },
	{
		component: NotificationWarning,
		name: "notification-warning",
		showBadge: true,
		showStripe: true,
	},
];

const mountNotificationBaseEmit = createMount(NotificationBaseEmitFixture, {
	props: { notification },
});

test.describe("notification fragments", () => {
	for (const fragment of notificationFragments) {
		const mountFragment = createMount(fragment.component, { props: { notification } });

		test.describe(fragment.name, () => {
			test("a component is rendered", async ({ mount, page }) => {
				await mountFragment(mount);

				await expect(page.getByTestId(fragment.name)).toBeVisible();
				await expect(page.getByTestId(fragment.name)).toContainText(notificationMessage);
			});

			test("the stripe is shown correctly", async ({ mount, page }) => {
				await mountFragment(mount);

				if (fragment.showStripe) {
					await expect(page.getByTestId(`${fragment.name}-stripe`)).toBeAttached();
				} else {
					await expect(page.getByTestId(`${fragment.name}-stripe`)).not.toBeVisible();
				}
			});

			test("the badge is shown correctly", async ({ mount, page }) => {
				await mountFragment(mount);

				if (fragment.showBadge) {
					await expect(page.getByTestId(`${fragment.name}-badge`)).toBeAttached();
				} else {
					await expect(page.getByTestId(`${fragment.name}-badge`)).not.toBeVisible();
				}
			});

			test.describe("title", () => {
				test("a simple notification does not include a title", async ({ mount, page }) => {
					await mountFragment(mount);

					await expect(page.getByTestId(`${fragment.name}-title`)).not.toBeAttached();
				});

				test("a notification can have a title", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: { notification: { ...notification, title: "Notification title" } },
					});

					await expect(page.getByTestId(`${fragment.name}-title`)).toBeVisible();
				});
			});

			test.describe("date", () => {
				test("a date is not shown when not present", async ({ mount, page }) => {
					await mountFragment(mount);

					await expect(page.getByTestId(`${fragment.name}-date`)).not.toBeAttached();
				});

				test("a notification can have a date", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: { notification: { ...notification, date: "2025-03-29" }, locale: "en-GB" },
					});

					await expect(page.getByTestId(`${fragment.name}-date`)).toBeVisible();
					await expect(page.getByTestId(`${fragment.name}-date`)).toHaveText("29 Mar 2025");
				});

				test("the date format can be customised", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: {
							notification: { ...notification, date: "2025-03-29" },
							locale: "en-GB",
							dateFormat: { year: "numeric", day: "2-digit", month: "short" },
						},
					});

					await expect(page.getByTestId(`${fragment.name}-date`)).toHaveText("29 Mar 2025");
				});

				test("the date locale can be changed", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: {
							notification: { ...notification, date: "2025-03-29" },
							locale: "de-DE",
						},
					});

					await expect(page.getByTestId(`${fragment.name}-date`)).toHaveText("29.03.2025");
				});
			});

			test.describe("icon", () => {
				test("an icon is not shown when not present", async ({ mount, page }) => {
					await mountFragment(mount);

					await expect(page.getByTestId(`${fragment.name}-icon`)).not.toBeAttached();
				});

				test("a notification can have an icon", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: { notification: { ...notification, icon: "icon-user" } },
					});

					await expect(page.getByTestId(`${fragment.name}-icon`)).toBeVisible();
				});
			});

			test.describe("image", () => {
				test("an image is not shown when not present", async ({ mount, page }) => {
					await mountFragment(mount);

					await expect(page.getByTestId(`${fragment.name}-image`)).not.toBeAttached();
				});

				test("a notification can have an image", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: { notification: { ...notification, image_url: "https://placehold.co/100x100" } },
					});

					await expect(page.getByTestId(`${fragment.name}-image`)).toBeVisible();
				});

				test("an image takes precedence over an icon", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: {
							notification: {
								...notification,
								icon: "icon-user",
								image_url: "https://placehold.co/100x100",
							},
						},
					});

					await expect(page.getByTestId(`${fragment.name}-image`)).toBeVisible();
					await expect(page.getByTestId(`${fragment.name}-icon`)).not.toBeAttached();
				});
			});

			test.describe("view more", () => {
				test("a view-more link is not shown when no URL is present", async ({ mount, page }) => {
					await mountFragment(mount);

					await expect(page.getByTestId(`${fragment.name}-view-more`)).not.toBeAttached();
				});

				test("a notification can have a view-more link", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: { notification: { ...notification, url: "https://example.com" } },
					});

					await expect(page.getByTestId(`${fragment.name}-view-more`)).toBeVisible();
				});

				test("the view-more-label slot can be implemented", async ({ mount, page }) => {
					await mountFragment(mount, {
						props: { notification: { ...notification, url: "https://example.com" } },
						slots: { "view-more-label": "View something" },
					});

					await expect(page.getByTestId(`${fragment.name}-view-more`)).toContainText(
						"View something",
					);
				});
			});
		});
	}

	test.describe("notification-base mark read", () => {
		test("a mark-read button is not shown when no ID is present", async ({ mount, page }) => {
			await mountNotificationBaseEmit(mount, {
				props: { notification: { ...notification, id: undefined } },
			});

			await expect(page.getByTestId("notification-base-mark-read")).not.toBeAttached();
		});

		test("clicking mark read emits the notification ID", async ({ mount, page }) => {
			await mountNotificationBaseEmit(mount);

			await page.getByTestId("notification-base-mark-read").click();

			await expect(page.getByTestId("notification-base-emitted-read")).toHaveAttribute(
				"data-notification-id",
				"notification-1",
			);
		});

		test("the mark-read-label slot can be implemented", async ({ mount, page }) => {
			await mountNotificationBaseEmit(mount, { slots: { "mark-read-label": "Read something" } });

			await expect(page.getByTestId("notification-base-mark-read")).toHaveText("Read something");
		});
	});
});
