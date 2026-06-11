import { createMount } from "@cypress/support/mount";
import { useFlashMessages } from "@/composables";
import { h } from "vue";

import FlashMessages from "./flash-messages.vue";

const mount = createMount(FlashMessages);

// A global flash message shown by unscoped flash-messages instances.
const globalMessage = {
	type: "success",
	title: "Alert approved",
	message: "The alert has been approved.",
};

// A namespaced flash message shown by matching flash-messages instances.
const namespacedMessage = {
	namespace: "user-alert",
	type: "success",
	title: "Alert approved",
	message: "The alert has been approved.",
};

describe("flash-messages", () => {
	afterEach(() => {
		const { _clearMessages } = useFlashMessages();

		_clearMessages();
	});

	it("Global messages are shown by default", () => {
		const { sendMessage } = useFlashMessages();

		sendMessage(globalMessage);
		sendMessage(namespacedMessage);
		mount();

		cy.getByData("alert-message").shouldBeVisible();
		cy.getByData("alert-message-title").shouldHaveText("Alert approved");
		cy.getByData("alert-message").should("contain", "The alert has been approved.");
		cy.getByData("alert-message").shouldHaveCount(1);
	});

	it("Namespaced messages are shown when the namespace matches", () => {
		const { sendMessage } = useFlashMessages();

		sendMessage(globalMessage);
		sendMessage(namespacedMessage);
		mount({ namespace: "user-alert" });

		cy.getByData("alert-message").shouldBeVisible();
		cy.getByData("alert-message-title").shouldHaveText("Alert approved");
		cy.getByData("alert-message").should("contain", "The alert has been approved.");
		cy.getByData("alert-message").shouldHaveCount(1);
	});

	it("Messages can be displayed with custom content", () => {
		const { sendMessage } = useFlashMessages();

		sendMessage(globalMessage);
		mount({
			slots: {
				default: ({ message }) =>
					h("p", { "data-test": "custom-flash-message" }, `${message.title}: ${message.message}`),
			},
		});

		cy.getByData("custom-flash-message").shouldHaveText(
			"Alert approved: The alert has been approved.",
		);
		cy.getByData("alert-message").should("not.exist");
	});
});
