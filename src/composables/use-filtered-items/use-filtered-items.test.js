import { describe, expect, test } from "vite-plus/test";
import { ref } from "vue";
import { useFilteredItems } from "./use-filtered-items.js";

const items = [
	{ name: "Alice", role: "admin", active: true },
	{ name: "Bob", role: "editor", active: true },
	{ name: "Carol", role: "editor", active: false },
];

describe("use-filtered-items", () => {
	describe("items", () => {
		test("Returns an empty array when no items are provided", () => {
			const { items } = useFilteredItems([]);

			expect(items.value).toEqual([]);
		});

		test("Returns an empty array when items is undefined", () => {
			const { items } = useFilteredItems(undefined);

			expect(items.value).toEqual([]);
		});

		test("Returns every item when no filters are provided", () => {
			const { items: filteredItems } = useFilteredItems(items);

			expect(filteredItems.value).toEqual(items);
		});

		test("Filters items by a single property", () => {
			const { items: filteredItems } = useFilteredItems(items, { role: "editor" });

			expect(filteredItems.value).toEqual([items[1], items[2]]);
		});

		test("Filters a getter-backed item collection", () => {
			const { items: filteredItems } = useFilteredItems(() => items, { role: "editor" });

			expect(filteredItems.value).toEqual([items[1], items[2]]);
		});

		test("Filters items by multiple properties", () => {
			const { items: filteredItems } = useFilteredItems(items, { role: "editor", active: true });

			expect(filteredItems.value).toEqual([items[1]]);
		});

		test("Matches any value in an array filter", () => {
			const { items: filteredItems } = useFilteredItems(items, { role: ["admin", "editor"] });

			expect(filteredItems.value).toEqual(items);
		});

		test("Filters by a nested property path", () => {
			const nestedItems = [{ profile: { role: "admin" } }, { profile: { role: "editor" } }];
			const { items: filteredItems } = useFilteredItems(nestedItems, { "profile.role": "admin" });

			expect(filteredItems.value).toEqual([nestedItems[0]]);
		});

		test("Reacts to items and filters updating", () => {
			const itemsRef = ref([...items]);
			const filtersRef = ref({ role: "admin" });
			const { items: filteredItems } = useFilteredItems(itemsRef, filtersRef);

			expect(filteredItems.value).toEqual([items[0]]);

			filtersRef.value = { role: "editor" };

			expect(filteredItems.value).toEqual([items[1], items[2]]);
		});

		test("Reacts to getter-backed items and filters updating", () => {
			const itemsRef = ref([...items]);
			const filtersRef = ref({ role: "admin" });

			const { items: filteredItems } = useFilteredItems(
				() => itemsRef.value,
				() => filtersRef.value,
			);

			expect(filteredItems.value).toEqual([items[0]]);

			filtersRef.value = { role: "editor" };

			expect(filteredItems.value).toEqual([items[1], items[2]]);

			itemsRef.value = [items[2]];

			expect(filteredItems.value).toEqual([items[2]]);
		});
	});

	describe("count and have", () => {
		test("Reflects the number of matching items", () => {
			const { count } = useFilteredItems(items, { role: "editor" });

			expect(count.value).toBe(2);
		});

		test("have is false when no items match", () => {
			const { have } = useFilteredItems(items, { role: "unknown" });

			expect(have.value).toBe(false);
		});

		test("have is true when at least one item matches", () => {
			const { have } = useFilteredItems(items, { role: "admin" });

			expect(have.value).toBe(true);
		});
	});
});
