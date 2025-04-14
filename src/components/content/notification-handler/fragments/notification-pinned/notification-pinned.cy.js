import NotificationPinned from "./notification-pinned.vue";
import { createMount } from "@cypress/support/mount";

const notificationMessage = "Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";
const notification = { id: "notification-1", message: notificationMessage };
const defaultProps = { notification };
const mount = createMount(NotificationPinned, { props: defaultProps });

describe("notification-pinned", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-pinned").shouldBeVisible();
		cy.getByData("notification-pinned").shouldHaveText(notificationMessage);
		cy.getByData("notification-pinned-stripe").shouldBeVisible();
		cy.getByData("notification-pinned-badge").shouldBeVisible();
	});

	describe("Features", () => {
		it("A simple notification does not include extras", () => {
			mount();

			cy.getByData("notification-pinned-title").should("not.exist");
		});

		describe("Title", () => {
			it("A title is not shown when it isn't present", () => {
				mount();

				cy.getByData("notification-pinned-title").should("not.exist");
			});

			it("A notification can have a title", () => {
				mount({ notification: { ...notification, title: "Notification title" } });

				cy.getByData("notification-pinned-title").shouldBeVisible();
			});
		});

		describe("Date", () => {
			it("A date is not shown when it isn't present", () => {
				mount();

				cy.getByData("notification-pinned-date").should("not.exist");
			});

			it("A notification can have a date", () => {
				mount({ notification: { ...notification, date: "2025-03-29" } });

				cy.getByData("notification-pinned-date").shouldBeVisible().shouldHaveText("29/03/2025");
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

				cy.getByData("notification-pinned-date").shouldBeVisible().shouldHaveText("29 Mar 2025");
			});

			it("The date locale can be changed", () => {
				mount({
					notification: {
						...notification,
						date: "2025-03-29",
					},
					locale: "de-DE",
				});

				cy.getByData("notification-pinned-date").shouldBeVisible().shouldHaveText("29.3.2025");
			});
		});

		describe("Icon", () => {
			it("An icon is not shown when it isn't present", () => {
				mount();

				cy.getByData("notification-pinned-icon").should("not.exist");
			});

			it("A notification can have an icon", () => {
				mount({ notification: { ...notification, icon: "icon-user" } });

				cy.getByData("notification-pinned-icon").shouldBeVisible();
			});
		});

		describe("Image", () => {
			it("An image is not shown when it isn't present", () => {
				mount();

				cy.getByData("notification-pinned-image").should("not.exist");
			});

			it("A notification can have an image", () => {
				mount({ notification: { ...notification, image_url: "https://placehold.co/100x100" } });

				cy.getByData("notification-pinned-image").shouldBeVisible();
			});

			it("A notification image takes precedence if both an image and an icon are defined", () => {
				mount({ notification: { ...notification, icon: "icon-user", image_url: "https://placehold.co/100x100" } });

				cy.getByData("notification-pinned-image").shouldBeVisible();
				cy.getByData("notification-pinned-icon").should("not.exist");
			});
		});

		describe("View more", () => {
			it("A link to view more is not shown when no URL is present", () => {
				mount();

				cy.getByData("notification-pinned-view-more").should("not.exist");
			});

			it("A notification can have a link to view more information", () => {
				mount({ notification: { ...notification, url: "https://example.com" } });

				cy.getByData("notification-pinned-view-more").shouldBeVisible();
			});

			it("The `view-more-label` slot can be implemented", () => {
				mount({
					props: {  notification: { ...notification, url: "https://example.com" } },
					slots: { "view-more-label": "View something" },
				});

				cy.getByData("notification-pinned-view-more").shouldHaveText("View something");
			});
		});
	});
});
