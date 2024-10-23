import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import SearchableList from "./searchable-list.vue";

const mount = createMount(SearchableList);

describe("searchable-list", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
