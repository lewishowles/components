import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import IconFilm from "./icon-film.vue";

const mount = createMount(IconFilm);

describe("icon-film", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
