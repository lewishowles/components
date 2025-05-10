import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NotificationDanger from "./notification-danger.vue";

const mount = createMount(NotificationDanger);

describe("notification-danger", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
