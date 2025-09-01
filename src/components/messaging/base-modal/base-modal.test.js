import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import BaseModal from "./base-modal.vue";

const mount = createMount(BaseModal);

describe("base-modal", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
