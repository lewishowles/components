import NotificationInfo from "./notification-info.vue";
import { createMount } from "@cypress/support/mount";

const notificationMessage = "Ullamco eu amet labore elit quis eiusmod ea consectetur fugiat do commodo esse dolore consequat ipsum.";
const notification = { id: "notification-1", message: notificationMessage };
const defaultProps = { notification };
const mount = createMount(NotificationInfo, { props: defaultProps });

describe("notification-info", () => {
	it("A component is rendered", () => {
		mount();

		cy.getByData("notification-info").shouldBeVisible();
		cy.getByData("notification-info").shouldHaveText(notificationMessage);
		cy.getByData("notification-info-stripe").shouldBeVisible();
		cy.getByData("notification-info-badge").shouldBeVisible();
	});

	describe("Features", () => {
		it("A simple notification does not include extras", () => {
			mount();

			cy.getByData("notification-info-title").should("not.exist");
		});

		it("A notification can have a title", () => {
			mount({ notification: { ...notification, title: "Notification title" } });

			cy.getByData("notification-info-title").shouldBeVisible();
		});
	});
});
