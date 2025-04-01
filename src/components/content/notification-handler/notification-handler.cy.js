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
			it("The `notification-read-template` slot can be implemented", () => {
				mount({
					props: { notifications: generateNotifications(1, { read: true }) },
					slots: { "notification-read-template": "Read slot {{ params.notification.message }}" },
				});

				openNotificationPanel();

				cy.getByData("notification-handler-notifications").shouldHaveText(`Read slot ${notificationMessage}`);
			});

			it("The `notification-info-template` slot can be implemented", () => {
				mount({
					props: { notifications: generateNotifications(1, { read: false }) },
					slots: { "notification-info-template": "Info slot {{ params.notification.message }}" },
				});

				openNotificationPanel();

				cy.getByData("notification-handler-notifications").shouldHaveText(`Info slot ${notificationMessage}`);
			});

			it("The `view-more-label` slot can be implemented", () => {
				mount({
					props: { notifications: generateNotifications(1, { url: "https://example.com" }) },
					slots: { "view-more-label": "View something" },
				});

				openNotificationPanel();

				cy.getByData("notification-info-view-more").shouldHaveText("View something");
			});
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
