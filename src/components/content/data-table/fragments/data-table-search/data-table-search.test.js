import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DataTableSearch from "./data-table-search.vue";

const global = { provide: { "data-table": { searchPlaceholder: "Search movies by title or year of release" } } };
const mount = createMount(DataTableSearch, { global });

describe("data-table-search", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Methods", () => {
		describe("resetSearchQuery", () => {
			test("should reset the current search query", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				vm.searchQuery = "toy";

				vm.resetSearchQuery();

				expect(vm.searchQuery).toBe("");
			});
		});
	});
});
