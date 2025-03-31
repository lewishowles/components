import NotificationRead from "./notification-read.vue";
import { createMount } from "@cypress/support/mount";

const notificationMessage = "Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";
const notification = { id: "notification-1", message: notificationMessage };
const defaultProps = { notification };
const mount = createMount(NotificationRead, { props: defaultProps });

describe("notification-read", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-read").shouldBeVisible();
		cy.getByData("notification-read").shouldHaveText(notificationMessage);
		cy.getByData("notification-read-stripe").shouldNotBeVisible();
		cy.getByData("notification-read-badge").shouldNotBeVisible();
	});

	describe("Features", () => {
		it("A simple notification does not include extras", () => {
			mount();

			cy.getByData("notification-read-title").should("not.exist");
		});

		describe("Title", () => {
			it("A title is not shown when it isn't present", () => {
				mount();

				cy.getByData("notification-read-title").should("not.exist");
			});

			it("A notification can have a title", () => {
				mount({ notification: { ...notification, title: "Notification title" } });

				cy.getByData("notification-read-title").shouldBeVisible();
			});
		});

		describe("Date", () => {
			it("A date is not shown when it isn't present", () => {
				mount();

				cy.getByData("notification-read-date").should("not.exist");
			});

			it("A notification can have a date", () => {
				mount({ notification: { ...notification, date: "2025-03-29" } });

				cy.getByData("notification-read-date").shouldBeVisible().shouldHaveText("29/03/2025");
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

				cy.getByData("notification-read-date").shouldBeVisible().shouldHaveText("29 Mar 2025");
			});

			it("The date locale can be changed", () => {
				mount({
					notification: {
						...notification,
						date: "2025-03-29",
					},
					locale: "de-DE",
				});

				cy.getByData("notification-read-date").shouldBeVisible().shouldHaveText("29.3.2025");
			});
		});

		describe("Icon", () => {
			it("An icon is not shown when it isn't present", () => {
				mount();

				cy.getByData("notification-read-icon").should("not.exist");
			});

			it("A notification can have an icon", () => {
				mount({ notification: { ...notification, icon: "icon-user" } });

				cy.getByData("notification-read-icon").shouldBeVisible();
			});
		});

		describe("Image", () => {
			it("An image is not shown when it isn't present", () => {
				mount();

				cy.getByData("notification-read-image").should("not.exist");
			});

			it("A notification can have an image", () => {
				mount({ notification: { ...notification, image_url: "https://placehold.co/100x100" } });

				cy.getByData("notification-read-image").shouldBeVisible();
			});

			it("A notification image takes precedence if both an image and an icon are defined", () => {
				mount({ notification: { ...notification, icon: "icon-user", image_url: "https://placehold.co/100x100" } });

				cy.getByData("notification-read-image").shouldBeVisible();
				cy.getByData("notification-read-icon").should("not.exist");
			});
		});
	});
});
