import { afterEach, describe, expect, test } from "vite-plus/test";
import { useFlashMessages } from "./use-flash-messages.js";

// A global flash message with the same shape expected by `alert-message`.
const globalMessage = {
	type: "success",
	title: "Alert approved",
	message: "The alert has been approved.",
};

// A namespaced flash message shown near the relevant user alert list.
const namespacedMessage = {
	namespace: "user-alert",
	type: "success",
	title: "Alert approved",
	message: "The alert has been approved.",
};

/**
 * Match a stored message with an automatically generated ID.
 *
 * @param  {object}  message
 *     The sent message to match.
 */
function expectStoredMessage(message) {
	return {
		id: expect.any(String),
		...message,
	};
}

describe("useFlashMessages", () => {
	afterEach(() => {
		const { _clearMessages } = useFlashMessages();

		_clearMessages();
	});

	describe("Initialisation", () => {
		test("should initialise", () => {
			const response = useFlashMessages();

			expect(response).toBeTypeOf("object");
			expect(response.sendMessage).toBeTypeOf("function");
			expect(response.getMessages).toBeTypeOf("function");
			expect(response.clearMessages).toBeTypeOf("function");
		});
	});

	describe("Methods", () => {
		describe("sendMessage", () => {
			test("should store a global message", () => {
				const { getMessages, sendMessage } = useFlashMessages();

				sendMessage(globalMessage);

				expect(getMessages()).toEqual([expectStoredMessage(globalMessage)]);
			});

			test("should store a namespaced message", () => {
				const { getMessages, sendMessage } = useFlashMessages();

				sendMessage(namespacedMessage);

				expect(getMessages("user-alert")).toEqual([expectStoredMessage(namespacedMessage)]);
			});

			test("should add a unique ID to each message", () => {
				const { getMessages, sendMessage } = useFlashMessages();

				const secondMessage = {
					...globalMessage,
					title: "Alert rejected",
				};

				sendMessage(globalMessage);
				sendMessage(secondMessage);

				const [firstStoredMessage, secondStoredMessage] = getMessages();

				expect(firstStoredMessage.id).toBeTypeOf("string");
				expect(secondStoredMessage.id).toBeTypeOf("string");
				expect(firstStoredMessage.id).not.toBe(secondStoredMessage.id);
			});
		});

		describe("getMessages", () => {
			test("should return only global messages when no namespace is provided", () => {
				const { getMessages, sendMessage } = useFlashMessages();

				sendMessage(globalMessage);
				sendMessage(namespacedMessage);

				expect(getMessages()).toEqual([expectStoredMessage(globalMessage)]);
			});

			test("should return only messages for the provided namespace", () => {
				const { getMessages, sendMessage } = useFlashMessages();

				const otherNamespacedMessage = {
					...namespacedMessage,
					namespace: "other-alert",
					title: "Other alert approved",
				};

				sendMessage(globalMessage);
				sendMessage(namespacedMessage);
				sendMessage(otherNamespacedMessage);

				expect(getMessages("user-alert")).toEqual([expectStoredMessage(namespacedMessage)]);
			});

			test("should preserve message order", () => {
				const { getMessages, sendMessage } = useFlashMessages();

				const secondMessage = {
					...globalMessage,
					title: "Alert rejected",
					message: "The alert has been rejected.",
				};

				const thirdMessage = {
					...globalMessage,
					type: "info",
					title: "Alert updated",
					message: "The alert has been updated.",
				};

				sendMessage(globalMessage);
				sendMessage(secondMessage);
				sendMessage(thirdMessage);

				expect(getMessages()).toEqual([
					expectStoredMessage(globalMessage),
					expectStoredMessage(secondMessage),
					expectStoredMessage(thirdMessage),
				]);
			});
		});

		describe("clearMessages", () => {
			test("should clear only global messages when no namespace is provided", () => {
				const { clearMessages, getMessages, sendMessage } = useFlashMessages();

				sendMessage(globalMessage);
				sendMessage(namespacedMessage);

				clearMessages();

				expect(getMessages()).toEqual([]);
				expect(getMessages("user-alert")).toEqual([expectStoredMessage(namespacedMessage)]);
			});

			test("should clear only messages for the provided namespace", () => {
				const { clearMessages, getMessages, sendMessage } = useFlashMessages();

				const otherNamespacedMessage = {
					...namespacedMessage,
					namespace: "other-alert",
					title: "Other alert approved",
				};

				sendMessage(globalMessage);
				sendMessage(namespacedMessage);
				sendMessage(otherNamespacedMessage);

				clearMessages("user-alert");

				expect(getMessages()).toEqual([expectStoredMessage(globalMessage)]);
				expect(getMessages("user-alert")).toEqual([]);
				expect(getMessages("other-alert")).toEqual([expectStoredMessage(otherNamespacedMessage)]);
			});
		});

		describe("_clearMessages", () => {
			test("should clear all messages", () => {
				const { _clearMessages, getMessages, sendMessage } = useFlashMessages();

				sendMessage(globalMessage);
				sendMessage(namespacedMessage);

				_clearMessages();

				expect(getMessages()).toEqual([]);
				expect(getMessages("user-alert")).toEqual([]);
			});
		});
	});
});
