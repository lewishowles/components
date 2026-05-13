import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconChat from "./icon-chat.vue";

const mount = createMount(IconChat);

describe("icon-chat", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
