import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconDashboard from "./icon-dashboard.vue";

const mount = createMount(IconDashboard);

describe("icon-dashboard", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
