import NotificationHandler from "./notification-handler.vue";
import { createMount } from "@cypress/support/mount";
import { nanoid } from "nanoid";

const mount = createMount(NotificationHandler, { props: { align: "start" } });

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
		message: "Mollit esse mollit aute id adipisicing. Do reprehenderit consequat non amet eu aliqua consequat do labore cupidatat sit sint elit pariatur. Mollit reprehenderit non et excepteur. Excepteur aliqua culpa nulla sint ad.",
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
