import NotificationBase from "./fragments/notification-base/notification-base.vue";
import NotificationDanger from "./fragments/notification-danger/notification-danger.vue";
import NotificationInfo from "./fragments/notification-info/notification-info.vue";
import NotificationPinned from "./fragments/notification-pinned/notification-pinned.vue";
import NotificationRead from "./fragments/notification-read/notification-read.vue";
import NotificationWarning from "./fragments/notification-warning/notification-warning.vue";
import { createMount } from "@cypress/support/mount";

const notificationMessage =
	"Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";

const notification = { id: "notification-1", message: notificationMessage };
const defaultProps = { notification };

const notificationFragments = [
	{
		component: NotificationBase,
		name: "notification-base",
		showBadge: true,
		showStripe: true,
		testMarkRead: true,
	},
	{
		component: NotificationDanger,
		name: "notification-danger",
		showBadge: true,
		showStripe: true,
	},
	{
		component: NotificationInfo,
		name: "notification-info",
		showBadge: true,
		showStripe: true,
	},
	{
		component: NotificationPinned,
		name: "notification-pinned",
		showBadge: true,
		showStripe: true,
	},
	{
		component: NotificationRead,
		name: "notification-read",
		showBadge: false,
		showStripe: false,
	},
	{
		component: NotificationWarning,
		name: "notification-warning",
		showBadge: true,
		showStripe: true,
	},
];

describe("notification fragments", () => {
	notificationFragments.forEach((fragment) => {
		describe(fragment.name, () => {
			const mount = createMount(fragment.component, { props: defaultProps });

			it("A component is rendered", () => {
				mount();

				cy.getByData(fragment.name).shouldBeVisible();
				cy.getByData(fragment.name).shouldHaveText(notificationMessage);

				if (fragment.showStripe) {
					cy.getByData(`${fragment.name}-stripe`).shouldBeVisible();
				} else {
					cy.getByData(`${fragment.name}-stripe`).shouldNotBeVisible();
				}

				if (fragment.showBadge) {
					cy.getByData(`${fragment.name}-badge`).shouldBeVisible();
				} else {
					cy.getByData(`${fragment.name}-badge`).shouldNotBeVisible();
				}
			});

			describe("Features", () => {
				it("A simple notification does not include extras", () => {
					mount();

					cy.getByData(`${fragment.name}-title`).should("not.exist");
				});

				describe("Title", () => {
					it("A notification can have a title", () => {
						mount({ notification: { ...notification, title: "Notification title" } });

						cy.getByData(`${fragment.name}-title`).shouldBeVisible();
					});
				});

				describe("Date", () => {
					it("A date is not shown when it isn't present", () => {
						mount();

						cy.getByData(`${fragment.name}-date`).should("not.exist");
					});

					it("A notification can have a date", () => {
						mount({ notification: { ...notification, date: "2025-03-29" } });

						cy.getByData(`${fragment.name}-date`).shouldBeVisible().shouldHaveText("29/03/2025");
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

						cy.getByData(`${fragment.name}-date`).shouldBeVisible().shouldHaveText("29 Mar 2025");
					});

					it("The date locale can be changed", () => {
						mount({
							notification: {
								...notification,
								date: "2025-03-29",
							},
							locale: "de-DE",
						});

						cy.getByData(`${fragment.name}-date`).shouldBeVisible().shouldHaveText("29.3.2025");
					});
				});

				describe("Icon", () => {
					it("An icon is not shown when it isn't present", () => {
						mount();

						cy.getByData(`${fragment.name}-icon`).should("not.exist");
					});

					it("A notification can have an icon", () => {
						mount({ notification: { ...notification, icon: "icon-user" } });

						cy.getByData(`${fragment.name}-icon`).shouldBeVisible();
					});
				});

				describe("Image", () => {
					it("An image is not shown when it isn't present", () => {
						mount();

						cy.getByData(`${fragment.name}-image`).should("not.exist");
					});

					it("A notification can have an image", () => {
						mount({ notification: { ...notification, image_url: "https://placehold.co/100x100" } });

						cy.getByData(`${fragment.name}-image`).shouldBeVisible();
					});

					it("A notification image takes precedence if both an image and an icon are defined", () => {
						mount({
							notification: {
								...notification,
								icon: "icon-user",
								image_url: "https://placehold.co/100x100",
							},
						});

						cy.getByData(`${fragment.name}-image`).shouldBeVisible();
						cy.getByData(`${fragment.name}-icon`).should("not.exist");
					});
				});

				describe("View more", () => {
					it("A link to view more is not shown when no URL is present", () => {
						mount();

						cy.getByData(`${fragment.name}-view-more`).should("not.exist");
					});

					it("A notification can have a link to view more information", () => {
						mount({ notification: { ...notification, url: "https://example.com" } });

						cy.getByData(`${fragment.name}-view-more`).shouldBeVisible();
					});

					it("The `view-more-label` slot can be implemented", () => {
						mount({
							props: { notification: { ...notification, url: "https://example.com" } },
							slots: { "view-more-label": "View something" },
						});

						cy.getByData(`${fragment.name}-view-more`).shouldHaveText("View something");
					});
				});

				if (fragment.testMarkRead) {
					describe("Mark read", () => {
						it("A button to mark read is not shown when no ID is present", () => {
							mount({ notification: { ...notification, id: undefined } });

							cy.getByData(`${fragment.name}-mark-read`).should("not.exist");
						});

						it("A button can be marked as read", () => {
							mount();

							cy.getByData(`${fragment.name}-mark-read`).shouldBeVisible().click();

							cy.get("@vue").should((wrapper) => {
								expect(wrapper.emitted("notification:read")).to.have.length(1);
								expect(wrapper.emitted("notification:read")[0][0]).to.equal("notification-1");
							});
						});

						it("The `mark-read-label` slot can be implemented", () => {
							mount({
								props: { notification: { ...notification } },
								slots: { "mark-read-label": "Read something" },
							});

							cy.getByData(`${fragment.name}-mark-read`).shouldHaveText("Read something");
						});
					});
				}
			});
		});
	});
});
