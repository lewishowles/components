import NotificationHandler from "./notification-handler.vue";
import { createMount } from "@cypress/support/mount";
import { nanoid } from "nanoid";

const mount = createMount(NotificationHandler, { props: { align: "start" } });
const notificationMessage = "Mollit esse mollit aute id adipisicing. Do reprehenderit consequat non amet eu aliqua consequat do labore cupidatat sit sint elit pariatur. Mollit reprehenderit non et excepteur. Excepteur aliqua culpa nulla sint ad.";

describe("notification-handler", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-handler").shouldBeVisible();
	});

	describe("Interaction", () => {
		it("The user can open and close the notification panel", () => {
			mount();

			openNotificationPanel();

			closeNotificationPanel();
		});
	});

	describe("Display", () => {
		it("\"Read\" notifications can be displayed", () => {
			mount({ notifications: generateNotifications(5, { read: true }) });

			cy.getByData("notification-handler-badge").should("not.exist");

			openNotificationPanel();

			cy.getByData("notification-read").shouldHaveCount(5);
		});

		it("\"Unread\" notifications can be displayed", () => {
			mount({ notifications: generateNotifications(5, { read: false }) });

			cy.getByData("notification-handler-badge").shouldBeVisible().shouldHaveText("5");

			openNotificationPanel();

			cy.getByData("notification-info").shouldHaveCount(5);
		});

		it("Mixed notifications can be displayed", () => {
			mount({
				notifications: [
					...generateNotifications(3, { read: false }),
					...generateNotifications(2, { read: true }),
				],
			});

			cy.getByData("notification-handler-badge").shouldBeVisible().shouldHaveText("3");

			openNotificationPanel();

			cy.getByData("notification-info").shouldHaveCount(3);
			cy.getByData("notification-read").shouldHaveCount(2);
		});

		describe("Slots", () => {
			describe("`notification-read-template`", () => {
				it("The `notification-read-template` slot can be implemented", () => {
					mount({
						props: { notifications: generateNotifications(1, { read: true }) },
						slots: { "notification-read-template": "Read slot {{ params.notification.message }}" },
					});

					openNotificationPanel();

					cy.getByData("notification-handler-notifications").shouldHaveText(`Read slot ${notificationMessage}`);
				});
			});

			describe("`notification-info-template`", () => {
				it("The `notification-info-template` slot can be implemented", () => {
					mount({
						props: { notifications: generateNotifications(1, { read: false }) },
						slots: { "notification-info-template": "Info slot {{ params.notification.message }}" },
					});

					openNotificationPanel();

					cy.getByData("notification-handler-notifications").shouldHaveText(`Info slot ${notificationMessage}`);
				});

				it("The user can utilise the `markNotificationRead` functionality provided by the slot", () => {
					mount({
						props: { notifications: [{ id: "notification-1", message: "Notification sample", read: false }] },
						slots: {
							"notification-info-template": `
								<template #default="{ notification, markNotificationRead }">
									<span>{{ notification.message }}</span>
									<button type="button" data-test="notification-info-custom-mark-read" @click="markNotificationRead">
										Mark as Read
									</button>
								</template>
							`,
						},
					});

					openNotificationPanel();

					cy.getByData("notification-info-custom-mark-read").shouldBeVisible().click();

					cy.get("@vue").then((wrapper) => {
						expect(wrapper.emitted("notifications:read")).to.have.length(1);
						expect(wrapper.emitted("notifications:read")[0][0][0]).to.equal("notification-1");
					});
				});
			});

			describe("`notification-warning-template`", () => {
				it("The `notification-warning-template` slot can be implemented", () => {
					mount({
						props: { notifications: generateNotifications(1, { type: "warning" }) },
						slots: { "notification-warning-template": "Info slot {{ params.notification.message }}" },
					});

					openNotificationPanel();

					cy.getByData("notification-handler-notifications").shouldHaveText(`Info slot ${notificationMessage}`);
				});

				it("The user can utilise the `markNotificationRead` functionality provided by the slot", () => {
					mount({
						props: { notifications: [{ id: "notification-1", message: "Notification sample", type: "warning" }] },
						slots: {
							"notification-warning-template": `
								<template #default="{ notification, markNotificationRead }">
									<span>{{ notification.message }}</span>
									<button type="button" data-test="notification-warning-custom-mark-read" @click="markNotificationRead">
										Mark as Read
									</button>
								</template>
							`,
						},
					});

					openNotificationPanel();

					cy.getByData("notification-warning-custom-mark-read").shouldBeVisible().click();

					cy.get("@vue").then((wrapper) => {
						expect(wrapper.emitted("notifications:read")).to.have.length(1);
						expect(wrapper.emitted("notifications:read")[0][0][0]).to.equal("notification-1");
					});
				});
			});

			describe("`notification-danger-template`", () => {
				it("The `notification-danger-template` slot can be implemented", () => {
					mount({
						props: { notifications: generateNotifications(1, { type: "danger" }) },
						slots: { "notification-danger-template": "Info slot {{ params.notification.message }}" },
					});

					openNotificationPanel();

					cy.getByData("notification-handler-notifications").shouldHaveText(`Info slot ${notificationMessage}`);
				});

				it("The user can utilise the `markNotificationRead` functionality provided by the slot", () => {
					mount({
						props: { notifications: [{ id: "notification-1", message: "Notification sample", type: "danger" }] },
						slots: {
							"notification-danger-template": `
								<template #default="{ notification, markNotificationRead }">
									<span>{{ notification.message }}</span>
									<button type="button" data-test="notification-danger-custom-mark-read" @click="markNotificationRead">
										Mark as Read
									</button>
								</template>
							`,
						},
					});

					openNotificationPanel();

					cy.getByData("notification-danger-custom-mark-read").shouldBeVisible().click();

					cy.get("@vue").then((wrapper) => {
						expect(wrapper.emitted("notifications:read")).to.have.length(1);
						expect(wrapper.emitted("notifications:read")[0][0][0]).to.equal("notification-1");
					});
				});
			});

			describe("`notification-pinned-template`", () => {
				it("The `notification-pinned-template` slot can be implemented", () => {
					mount({
						props: { notifications: generateNotifications(1, { pinned: true }) },
						slots: { "notification-pinned-template": "Info slot {{ params.notification.message }}" },
					});

					openNotificationPanel();

					cy.getByData("notification-handler-notifications").shouldHaveText(`Info slot ${notificationMessage}`);
				});
			});

			it("The `view-more-label` slot can be implemented", () => {
				mount({
					props: { notifications: generateNotifications(1, { url: "https://example.com" }) },
					slots: { "view-more-label": "View something" },
				});

				openNotificationPanel();

				cy.getByData("notification-info-view-more").shouldHaveText("View something");
			});

			it("The `notification-actions` slot can be implemented", () => {
				mount({
					props: { notifications: generateNotifications(1) },
					slots: { "notification-actions": "Additional actions" },
				});

				openNotificationPanel();

				cy.getByData("notification-info-actions").shouldHaveText("Additional actions");
			});
		});
	});

	describe("Interaction", () => {
		it("A notification can be marked as read", () => {
			mount({
				props: { notifications: [{ id: "notification-1", message: "Notification sample" }] },
			});

			openNotificationPanel();

			cy.getByData("notification-read").should("not.exist");
			cy.getByData("notification-info-mark-read").shouldBeVisible().click();

			cy.get("@vue").then((wrapper) => {
				expect(wrapper.emitted("notifications:read")).to.have.length(1);
				expect(wrapper.emitted("notifications:read")[0][0][0]).to.equal("notification-1");
			});

			cy.getByData("notification-info").should("not.exist");
			cy.getByData("notification-read").shouldBeVisible();
		});

		it("A read notification cannot be marked as read", () => {
			mount({
				props: { notifications: [{ id: "notification-1", message: "Notification sample", read: true }] },
			});

			openNotificationPanel();

			cy.getByData("notification-info").should("not.exist");
			cy.getByData("notification-read").shouldBeVisible();
			cy.getByData("notification-read-mark-read").should("not.exist");
		});

		it("All notifications can be marked as read", () => {
			mount({
				props: {
					notifications: [
						{ id: "notification-1", message: "Notification sample" },
						{ id: "notification-2", message: "Notification sample" },
						{ id: "notification-3", message: "Notification sample" },
					],
				},
			});

			openNotificationPanel();

			cy.getByData("notification-read").should("not.exist");
			cy.getByData("notification-info").shouldHaveCount(3);

			cy.getByData("notification-handler-mark-all-read").click();

			cy.get("@vue").then((wrapper) => {
				expect(wrapper.emitted("notifications:read")).to.have.length(1);
				expect(wrapper.emitted("notifications:read")[0][0][0]).to.deep.equal(["notification-1", "notification-2", "notification-3"]);
			});

			cy.getByData("notification-info").should("not.exist");
			cy.getByData("notification-read").shouldHaveCount(3);
		});
	});
});

/**
 * Generate a given number of notifications at random, with the provided
 * overrides.
 *
 * @param  {number}  count
 *     The number of notifications to generate.
 * @param  {object}  overrides
 *     Any data to override in the generated notifications.
 */
function generateNotifications(count, overrides) {
	return Array.from({ length: count }, () => generateNotification(overrides));
}

/**
 * Generate a single notification at random, with the provided overrides.
 *
 * @param  {object}  overrides
 *     Any data to override in the generated notification.
 */
function generateNotification(overrides) {
	return {
		id: nanoid(),
		message: notificationMessage,
		...overrides,
	};
}

/**
 * Open the notification panel, verifying its open state.
 */
function openNotificationPanel() {
	cy.getByData("notification-handler-content").shouldNotBeVisible();
	cy.getByData("notification-handler-summary").click();
	cy.getByData("notification-handler-content").shouldBeVisible();
}

/**
 * Close the notification panel, verifying its closed state.
 */
function closeNotificationPanel() {
	cy.getByData("notification-handler-content").shouldBeVisible();
	cy.getByData("notification-handler-summary").click();
	cy.getByData("notification-handler-content").shouldNotBeVisible();
}
