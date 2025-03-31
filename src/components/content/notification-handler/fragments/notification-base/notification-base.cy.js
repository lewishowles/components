import NotificationBase from "./notification-base.vue";
import { createMount } from "@cypress/support/mount";

const notificationMessage = "Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";
const notification = { id: "notification-1", message: notificationMessage };
const defaultProps = { notification };
const mount = createMount(NotificationBase, { props: defaultProps });

describe("notification-base", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-base").shouldBeVisible();
		cy.getByData("notification-base").shouldHaveText(notificationMessage);
		cy.getByData("notification-base-stripe").shouldBeVisible();
		cy.getByData("notification-base-badge").shouldBeVisible();
	});

	describe("Features", () => {
		it("A simple notification does not include extras", () => {
			mount();

			cy.getByData("notification-base-title").should("not.exist");
		});

		describe("Title", () => {
			it("A notification can have a title", () => {
				mount({ notification: { ...notification, title: "Notification title" } });

				cy.getByData("notification-base-title").shouldBeVisible();
			});
		});

		describe("Date", () => {
			it("A notification can have a date", () => {
				mount({ notification: { ...notification, date: "2025-03-29" } });

				cy.getByData("notification-base-date").shouldBeVisible().shouldHaveText("29/03/2025");
			});

			it("The date format can be customised", () => {
				mount({
					notification: {
						...notification,
						date: "2025-03-29",
					},
					dateFormat: {
						year: "numeric",
						day: "2-digit",
						month: "short",
					},
				});

				cy.getByData("notification-base-date").shouldBeVisible().shouldHaveText("29 Mar 2025");
			});

			it("The date locale can be changed", () => {
				mount({
					notification: {
						...notification,
						date: "2025-03-29",
					},
					locale: "de-DE",
				});

				cy.getByData("notification-base-date").shouldBeVisible().shouldHaveText("29.3.2025");
			});
		});
	});
});
