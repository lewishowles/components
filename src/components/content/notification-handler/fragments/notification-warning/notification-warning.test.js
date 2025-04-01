import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NotificationWarning from "./notification-warning.vue";

const mount = createMount(NotificationWarning);

describe("notification-warning", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
