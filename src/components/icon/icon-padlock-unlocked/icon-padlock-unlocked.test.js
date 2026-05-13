import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
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
