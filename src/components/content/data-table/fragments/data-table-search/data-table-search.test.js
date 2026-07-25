import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import { nextTick, ref } from "vue";
import DataTableSearch from "./data-table-search.vue";

const global = {
	provide: {
		"data-table": { searchPlaceholder: "Search movies by title or year of release" },
	},
};

const mount = createMount(DataTableSearch, { global });

describe("data-table-search", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("should update when the search placeholder changes at runtime", async () => {
			const searchPlaceholder = ref("Search by title");

			const wrapper = mount({
				global: { provide: { "data-table": { searchPlaceholder } } },
			});

			searchPlaceholder.value = "Search by year";
			await nextTick();

			expect(wrapper.vm.searchPlaceholder).toBe("Search by year");
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
