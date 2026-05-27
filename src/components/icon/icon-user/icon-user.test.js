import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import IconUser from "./icon-user.vue";

const mount = createMount(IconUser);

describe("icon-user", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
