import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import NoneFound from "./none-found.vue";

const mount = createMount(NoneFound);

describe("none-found", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
