import { arrayLength, isNonEmptyArray } from "@lewishowles/helpers/array";
import { computed, unref } from "vue";
import { getPathValue } from "@lewishowles/helpers/object";

/**
 * Filter a reactive item list by exact property matches.
 *
 * @param  {object[]|Ref<object[]>}  items
 *     The source items to filter.
 * @param  {object|Ref<object>}  [filters]
 *     The property paths and expected values to match. A property mapped to
 *     an array matches any of those values.
 */
export function useFilteredItems(items, filters = {}) {
	// The filter entries to apply to each item.
	const filterEntries = computed(() => {
		const activeFilters = unref(filters);

		if (!activeFilters) {
			return [];
		}

		return Object.entries(activeFilters);
	});

	// The items matching the provided filters.
	const filteredItems = computed(() => {
		const sourceItems = unref(items);

		if (!isNonEmptyArray(sourceItems)) {
			return [];
		}

		if (!isNonEmptyArray(filterEntries.value)) {
			return sourceItems;
		}

		return sourceItems.filter((item) => {
			return filterEntries.value.every(([propertyPath, expectedValue]) => {
				const expectedValues = Array.isArray(expectedValue) ? expectedValue : [expectedValue];
				const actualValue = getPathValue(item, propertyPath);

				return expectedValues.includes(actualValue);
			});
		});
	});

	// The number of matching items.
	const count = computed(() => arrayLength(filteredItems.value));
	// Whether any matching items are available.
	const have = computed(() => count.value > 0);

	return {
		count,
		have,
		items: filteredItems,
	};
}
