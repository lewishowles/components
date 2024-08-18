import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconCheckCircled from "./icon-check-circled.vue";

const mount = createMount(IconCheckCircled);

describe("icon-check-circled", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
