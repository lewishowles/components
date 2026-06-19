import { createMount } from "@lewishowles/testing/vue";
import { useFlashMessages } from "@/composables";
import { afterEach, describe, expect, test } from "vite-plus/test";

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

	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		describe("messages", () => {
			test("should return global messages by default", () => {
				const { sendMessage } = useFlashMessages();

				sendMessage(globalMessage);
				sendMessage(namespacedMessage);

				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.messages).toEqual([
					{
						id: expect.any(String),
						...globalMessage,
					},
				]);
			});

			test("should return messages for the provided namespace", () => {
				const { sendMessage } = useFlashMessages();

				sendMessage(globalMessage);
				sendMessage(namespacedMessage);

				const wrapper = mount({ namespace: "user-alert" });
				const vm = wrapper.vm;

				expect(vm.messages).toEqual([
					{
						id: expect.any(String),
						...namespacedMessage,
					},
				]);
			});
		});
	});
});
