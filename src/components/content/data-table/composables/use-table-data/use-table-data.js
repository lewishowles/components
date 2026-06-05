import { computed } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyObject, keys } from "@lewishowles/helpers/object";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyString } from "@lewishowles/helpers/string";

/**
 * Transform the provided data into the internal shape the data table works
 * with: each row gains a unique id, its raw form, and per-cell searchable and
 * sortable content (honouring any per-column content callbacks). Invalid rows
 * are dropped.
 *
 * @param  {object}  data
 *     A ref of the data provided to the table.
 * @param  {object}  columns
 *     A ref of the user's column configuration, used for content callbacks.
 */
export default function useTableData(data, columns) {
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
			const rowContent = keys(row).reduce((rowData, columnKey) => {
				rowData[columnKey] = {
					configuration: {
						searchable: getSearchableContent(row, columnKey),
						sortable: getSortableContent(row, columnKey),
					},
					content: row[columnKey],
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
	 * Get the searchable content of a cell; that is, either the content provided
	 * by the column searchable content callback, or the lowercase content of the
	 * cell itself.
	 *
	 * @param  {object}  row
	 *     The raw row provided to the table.
	 * @param  {string}  columnKey
	 *     The key for the column.
	 */
	function getSearchableContent(row, columnKey) {
		let searchableContent = row[columnKey];

		if (!isNonEmptyString(searchableContent)) {
			searchableContent = "";
		}

		const searchableContentCallback = columns.value[columnKey]?.searchableContentCallback;

		if (isFunction(searchableContentCallback)) {
			const callbackResponse = searchableContentCallback(columnKey, row);

			if (isNonEmptyString(callbackResponse)) {
				searchableContent = callbackResponse;
			}
		}

		if (isNonEmptyString(searchableContent)) {
			searchableContent = searchableContent.toLowerCase();
		}

		return searchableContent;
	}

	/**
	 * Get the sortable content of a cell; that is, either the content provided by
	 * the column sortable content callback, or the lowercase content of the cell
	 * itself.
	 *
	 * @param  {object}  row
	 *     The raw row provided to the table.
	 * @param  {string}  columnKey
	 *     The key for the column.
	 */
	function getSortableContent(row, columnKey) {
		let sortableContent = row[columnKey];

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

	return {
		haveData,
		internalData,
	};
}
