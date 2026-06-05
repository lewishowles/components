import { computed, ref, watch } from "vue";
import { cn } from "@/utilities/cn.js";
import { get, isNonEmptyObject, keys } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { useStorage } from "@vueuse/core";

/**
 * Manage columns for the data table: the column definitions derived from the
 * user's configuration, which columns are visible, and the table density.
 *
 * @param  {object}  options
 *     The reactive inputs.
 * @param  {object}  options.columns
 *     A ref of the user's column configuration.
 * @param  {string}  options.name
 *     The table's name, used to persist column visibility. Without a name,
 *     visibility is not persisted.
 * @param  {object}  options.haveData
 *     A ref reflecting whether the table has any data.
 * @param  {object}  options.headingClasses
 *     A ref of the table-level heading classes.
 * @param  {object}  options.cellClasses
 *     A ref of the table-level cell classes.
 */
export default function useTableColumns({ columns, name, haveData, headingClasses, cellClasses }) {
	// Our user-selected table density from the fragment component.
	const tableDensity = ref(null);
	// Our available table density options, as provided by the `data-table-density`
	// sub-component. This means we can provide slots for their labels, without
	// having to know what those available densities are from this component.
	const tableDensityOptions = ref([]);

	// The stored user-selected column visibility for this table.
	const userColumnVisibility = isNonEmptyString(name)
		? useStorage(`data-table:${name}:columns`, {})
		: ref({});

	// Our user-selected column visibility.
	const columnVisibility = ref({});

	initialiseColumnVisibility();

	// Our table spacing, based on our current density.
	const tableSpacingClasses = computed(() => {
		switch (tableDensity.value) {
			case "compact":
				return "py-2";
			case "standard":
				return "py-3";
			default:
				return "py-4";
		}
	});

	// A list of columns to display in the table, taking into account validation,
	// and containing the relevant data. We base these columns on those provided by
	// the user, which means that any column not configured will not be displayed by
	// default.
	const columnDefinitions = computed(() => {
		if (!haveData.value || !isNonEmptyObject(columns.value)) {
			return {};
		}

		const definitions = keys(columns.value).reduce((definitions, columnKey) => {
			const userConfiguration = get(columns.value, columnKey) || {};

			// If this column is hidden by configuration, we don't add it at all.
			const hiddenByConfiguration = get(userConfiguration, "hidden") === true;

			if (hiddenByConfiguration) {
				return definitions;
			}

			// However, if this column is hidden by the user's preferences, we want
			// to add it (as that preference may change, and we want to show the
			// checkbox), but we want to mark it as hidden.

			const hiddenByPreference = get(columnVisibility.value, columnKey) === false;

			definitions[columnKey] = {
				label: columnKey,
				first: false,
				last: false,
				sortable: true,
				tabularNums: false,
				visible: !hiddenByPreference,
				...userConfiguration,
			};

			return definitions;
		}, {});

		// After we determine which columns are present, we need to determine which
		// column is first and which is last, as columns may have been removed or
		// re-ordered by configuration.
		const columnKeys = keys(definitions);

		if (columnKeys.length > 0) {
			definitions[columnKeys[0]].first = true;
			definitions[columnKeys[columnKeys.length - 1]].last = true;
		}

		return definitions;
	});

	// Our column definitions, limited to those that are visible.
	const visibleColumnDefinitions = computed(() => {
		return keys(columnDefinitions.value).reduce((definitions, columnKey) => {
			const column = columnDefinitions.value[columnKey];

			if (column.visible) {
				definitions[columnKey] = column;
			}

			return definitions;
		}, {});
	});

	// Persist column visibility when users change the table configuration.
	watch(
		columnVisibility,
		() => {
			userColumnVisibility.value = columnVisibility.value;
		},
		{ deep: true },
	);

	/**
	 * Initialise column visibility based on any stored values.
	 */
	function initialiseColumnVisibility() {
		if (!isNonEmptyObject(columns.value)) {
			return;
		}

		const visibility = {};

		for (const columnKey of keys(columns.value)) {
			const userConfiguration = get(columns.value, columnKey) || {};
			const hiddenByConfiguration = get(userConfiguration, "hidden") === true;

			if (hiddenByConfiguration) {
				continue;
			}

			visibility[columnKey] = true;

			if (Object.hasOwn(userColumnVisibility.value, columnKey)) {
				visibility[columnKey] = userColumnVisibility.value[columnKey];
			}
		}

		columnVisibility.value = visibility;
		userColumnVisibility.value = visibility;
	}

	/**
	 * Merge table-level and column-level heading classes, with column-level
	 * classes taking precedence.
	 *
	 * @param  {object}  column
	 *     The column definition.
	 */
	function getHeadingClasses(column) {
		return cn(headingClasses.value, column.columnClasses, column.headingClasses);
	}

	/**
	 * Merge table-level and column-level cell classes, with column-level classes
	 * taking precedence.
	 *
	 * @param  {object}  column
	 *     The column definition.
	 */
	function getCellClasses(column) {
		return cn(
			tableSpacingClasses.value,
			cellClasses.value,
			column.columnClasses,
			column.cellClasses,
		);
	}

	/**
	 * Retrieve the label for the given column key from the column definitions.
	 *
	 * @param  {string}  columnKey
	 *     The column key to retrieve the label for.
	 */
	function getColumnLabel(columnKey) {
		return get(columnDefinitions.value, `${columnKey}.label`);
	}

	/**
	 * Update our local table density options, which allows us to provide slots to
	 * overwrite the labels, particularly useful for translation.
	 *
	 * @param  {Array}  options
	 *     The available density options.
	 */
	function updateTableDensityOptions(options) {
		if (!isNonEmptyArray(options)) {
			return;
		}

		tableDensityOptions.value = options;
	}

	return {
		columnDefinitions,
		columnVisibility,
		getCellClasses,
		getColumnLabel,
		getHeadingClasses,
		tableDensity,
		tableDensityOptions,
		updateTableDensityOptions,
		visibleColumnDefinitions,
	};
}
