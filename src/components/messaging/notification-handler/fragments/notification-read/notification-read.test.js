import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NotificationRead from "./notification-read.vue";

const mount = createMount(NotificationRead);

describe("notification-read", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
