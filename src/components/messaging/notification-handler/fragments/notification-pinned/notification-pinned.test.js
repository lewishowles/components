import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NotificationPinned from "./notification-pinned.vue";

const mount = createMount(NotificationPinned);

describe("notification-pinned", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
