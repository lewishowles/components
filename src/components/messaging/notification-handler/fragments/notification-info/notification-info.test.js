import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NotificationInfo from "./notification-info.vue";

const mount = createMount(NotificationInfo);

describe("notification-info", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
