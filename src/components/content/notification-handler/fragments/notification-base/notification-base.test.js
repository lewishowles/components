import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NotificationBase from "./notification-base.vue";

const mount = createMount(NotificationBase);

describe("notification-base", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
