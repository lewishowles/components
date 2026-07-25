import { computed, ref, watch } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isFunction } from "@lewishowles/helpers/general";
import { getPathValue, isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";

/**
 * Manage searching for the data table: the current query, whether a search is
 * active, and the rows that match it. A column opts out of search with
 * `searchable: false`, or provides its own matcher with `searchCallback`.
 *
 * @param  {object}  internalData
 *     A ref of the table's internalised rows.
 * @param  {object}  columns
 *     A ref of the column configuration, used to honour per-column search rules.
 */
export default function useTableSearch(internalData, columns, options = {}) {
	const { isServerMode = ref(false), state = ref(null) } = options;

	// The current search query, as provided by the search sub-component.
	const searchQuery = ref(
		isServerMode.value && isNonEmptyString(state.value?.filters?.search)
			? state.value.filters.search
			: "",
	);

	// Whether we have a search term, and thus whether the user is currently
	// searching.
	const haveSearchQuery = computed(() => isNonEmptyString(searchQuery.value));

	// Our internal data, filtered to those rows matching any current search term.
	const filteredRows = computed(() => {
		if (isServerMode.value) {
			return internalData.value;
		}

		if (!isNonEmptyArray(internalData.value)) {
			return [];
		}

		if (!haveSearchQuery.value) {
			return internalData.value;
		}

		const searchTerm = searchQuery.value.toLowerCase();

		return internalData.value.reduce((rows, row) => {
			const rowContent = getPathValue(row, "content");

			if (!isNonEmptyObject(rowContent)) {
				return rows;
			}

			const includesTerm = Object.entries(rowContent).some(([columnKey, cell]) => {
				// Only columns with an explicit definition are searched. Within
				// those, `searchable: false` opts a column out.
				const columnDefined = columnKey in (columns.value ?? {});

				const searchableColumn =
					columnDefined && getPathValue(columns.value, `${columnKey}.searchable`) !== false;

				// If this column isn't searchable, we don't need to check it.
				if (!searchableColumn) {
					return false;
				}

				const searchableContent = getPathValue(cell, "configuration.searchable");

				// If the column has a custom search callback, use that over our
				// default match rule.
				const searchCallback = columns.value[columnKey]?.searchCallback;

				if (isFunction(searchCallback)) {
					return searchCallback({
						searchQuery: searchQuery.value,
						columnKey,
						cell: searchableContent,
						row,
					});
				}

				return isNonEmptyString(searchableContent) && searchableContent.includes(searchTerm);
			});

			// If we find the term in the searchable columns of this row, we add it
			// to our list of rows to display.
			if (includesTerm) {
				rows.push(row);
			}

			return rows;
		}, []);
	});

	// Keep the server filter state in the single controlled state model.
	watch(searchQuery, (value) => {
		if (!isServerMode.value) {
			return;
		}

		const currentState = state.value ?? {};
		const currentFilters = currentState.filters ?? {};

		if (currentState.page === 1 && currentFilters.search === value) {
			return;
		}

		state.value = {
			...currentState,
			filters: { ...currentFilters, search: value },
			page: 1,
		};
	});

	// Reflect externally controlled server filters in the search input.
	watch(
		() => state.value?.filters?.search,
		(value) => {
			if (!isServerMode.value) {
				return;
			}

			const nextQuery = isNonEmptyString(value) ? value : "";

			if (nextQuery !== searchQuery.value) {
				searchQuery.value = nextQuery;
			}
		},
	);

	return {
		filteredRows,
		haveSearchQuery,
		searchQuery,
	};
}
