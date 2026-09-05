import { computed, ref } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { getPathValue, isNonEmptyObject, keys } from "@lewishowles/helpers/object";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyString } from "@lewishowles/helpers/string";

/**
 * Transform the provided data into the internal shape the data table works
 * with: each row gains a unique id, its raw form, and per-cell display,
 * searchable, and sortable content (honouring any configured column source
 * or content callbacks). Invalid rows are dropped.
 *
 * @param  {object}  data
 *     A ref of the data provided to the table.
 * @param  {object}  columns
 *     A ref of the user's column configuration, used to resolve each
 *     cell's source and content callbacks.
 * @param  {object}  [options]
 *     Table-wide state shared with sibling composables.
 * @param  {object}  [options.isServerMode]
 *     A ref indicating whether the table is in server mode. When true,
 *     configured searchSource and sortSource callbacks are not invoked.
 */
export default function useTableData(data, columns, options = {}) {
	const { isServerMode = ref(false) } = options;

	// Transform the provided data into something more suitable for display in our
	// table. This includes adding cell configuration for internal tracking, and
	// removing any rows that seem to be invalid.
	const internalData = computed(() => {
		if (!isNonEmptyArray(data.value)) {
			return [];
		}

		return data.value.reduce((rows, row) => {
			if (!isNonEmptyObject(row)) {
				return rows;
			}

			// We update the structure of our data, allowing for both row and cell
			// configuration in addition to the provided data, but we avoid the user
			// having to know what that structure is.
			const columnKeys = [...new Set([...keys(row), ...keys(columns.value)])];

			const rowContent = columnKeys.reduce((rowData, columnKey) => {
				rowData[columnKey] = {
					configuration: {
						searchable: getSearchableContent(row, columnKey),
						sortable: getSortableContent(row, columnKey),
					},
					content: getDisplayContent(row, columnKey),
				};

				return rowData;
			}, {});

			rows.push({
				configuration: {
					id: crypto.randomUUID(),
				},
				content: rowContent,
				raw: row,
			});

			return rows;
		}, []);
	});

	// Whether we have any data for our table. That is, the provided data was
	// validated and contains a non-empty array of at least one object.
	const haveData = computed(() => isNonEmptyArray(internalData.value));

	/**
	 * Get the searchable content of a cell: a configured searchSource, falling
	 * back to the cell's resolved display content, then lowercased. A search
	 * content callback overrides the resolved value when it returns a string.
	 * searchSource is skipped in server mode, where search is handled
	 * server-side.
	 *
	 * @param  {object}  row
	 *     The raw row provided to the table.
	 * @param  {string}  columnKey
	 *     The key for the column.
	 */
	function getSearchableContent(row, columnKey) {
		const searchSource = columns.value[columnKey]?.searchSource;

		let searchableContent;

		if (!isServerMode.value && isFunction(searchSource)) {
			searchableContent = searchSource(row);
		} else if (!isServerMode.value && isNonEmptyString(searchSource)) {
			searchableContent = getPathValue(row, searchSource);
		} else {
			searchableContent = getDisplayContent(row, columnKey);
		}

		const searchableContentCallback = columns.value[columnKey]?.searchableContentCallback;

		if (isFunction(searchableContentCallback)) {
			const callbackResponse = searchableContentCallback(columnKey, row);

			if (isNonEmptyString(callbackResponse)) {
				searchableContent = callbackResponse;
			}
		}

		if (!isNonEmptyString(searchableContent)) {
			searchableContent = "";
		}

		if (isNonEmptyString(searchableContent)) {
			searchableContent = searchableContent.toLowerCase();
		}

		return searchableContent;
	}

	/**
	 * Get the sortable content of a cell: a configured sortSource, falling back
	 * to the cell's resolved display content. A sortable content callback
	 * overrides the resolved value when it returns a string. sortSource is
	 * skipped in server mode, where sorting is handled server-side.
	 *
	 * @param  {object}  row
	 *     The raw row provided to the table.
	 * @param  {string}  columnKey
	 *     The key for the column.
	 */
	function getSortableContent(row, columnKey) {
		const sortSource = columns.value[columnKey]?.sortSource;

		let sortableContent;

		if (!isServerMode.value && isFunction(sortSource)) {
			sortableContent = sortSource(row);
		} else if (!isServerMode.value && isNonEmptyString(sortSource)) {
			sortableContent = getPathValue(row, sortSource);
		} else {
			sortableContent = getDisplayContent(row, columnKey);
		}

		const sortableContentCallback = columns.value[columnKey]?.sortableContentCallback;

		if (isFunction(sortableContentCallback)) {
			const callbackResponse = sortableContentCallback(columnKey, row);

			if (isNonEmptyString(callbackResponse)) {
				sortableContent = callbackResponse;
			}
		}

		if (isNonEmptyString(sortableContent)) {
			sortableContent = sortableContent.toLowerCase();
		}

		return sortableContent;
	}

	/**
	 * Get the display content for a cell from its configured source or the column
	 * key, while keeping the raw row available.
	 *
	 * @param  {object}  row
	 *     The raw row provided to the table.
	 * @param  {string}  columnKey
	 *     The key for the column.
	 */
	function getDisplayContent(row, columnKey) {
		const source = columns.value[columnKey]?.source;

		if (isFunction(source)) {
			return source(row);
		}

		return getPathValue(row, isNonEmptyString(source) ? source : columnKey);
	}

	return {
		haveData,
		internalData,
	};
}
