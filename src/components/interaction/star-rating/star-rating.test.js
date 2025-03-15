import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import StarRating from "./star-rating.vue";

const mount = createMount(StarRating);

describe("star-rating", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
