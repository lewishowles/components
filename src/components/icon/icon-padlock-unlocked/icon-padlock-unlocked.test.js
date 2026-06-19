import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import IconPadlockUnlocked from "./icon-padlock-unlocked.vue";

const mount = createMount(IconPadlockUnlocked);

describe("icon-padlock-unlocked", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
