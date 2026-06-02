# `data-table`

`data-table` can display complex data with minimal effort. From hiding columns to controlling their order, managing data is simple and means that the minimum amount of data manipulation needs to be done beforehand.

When it comes to whether to format data before passing it to the table, versus formatting it using cell templates, the latter is recommended. If the data is passed to the table in a more raw form, it may be easier for a table to be sortable out of the box (for example, with integers versus formatted currency strings). You then have ultimate control over formatting for each cell, in a way that's more flexible than passing pre-formatted data through.

## Slots

### `table-title`

Any title to display with this table.

### `table-introduction`

Any introduction to display with this table.

### `caption`

An optional visible caption to display above the table. When the table overflows its container, this caption is also used to label the scrollable region for assistive technology.

### `search-label`

The label to use for the search box.

### `reset-search-label`

- default: "Reset search"

The label to use for the "Reset search" button.

### `post-search`

A slot to allow adding content to the table's title bar, after the search box.

### `pre-configure`

A slot to allow adding content to the table's title bar, before configuration.

#### Slot props

##### `...`

- type: `string`

...

### `sorted-hint`

- default: "Sorted by {sortedColumn} ascending/descending"

A screen-reader-only hint rendered inside the caption area, announcing which column the table is currently sorted by. Only rendered when a column is sorted.

| Slot prop      | Type    | Description                                     |
| -------------- | ------- | ----------------------------------------------- |
| `sortedColumn` | string  | The label of the column currently being sorted. |
| `ascending`    | boolean | Whether the column is sorted ascending.         |

### `no-data-message`

- default: "No data to display."

The message to display when no data could be found for the table.

### `no-results-message`

- default: "No results could be found for term &lt;span class="font-bold"&gt;"{{ searchQuery }}"&lt;/span&gt;."

The message to display when no data could be found for the current search term.

| Slot prop     | Type     | Description                            |
| ------------- | -------- | -------------------------------------- |
| `searchQuery` | `string` | The current search query in the table. |

### `<columnName>_heading`

- default: The heading provided within `configuration`, or the column key.

Provides the ability to override the label for a particular column, by its key from the original data. Provided to the slot are is the key for that column.

| Slot prop | Type   | Description                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
| `key`     | string | The key for this column, as determined by the original data provided.        |
| `label`   | string | The current label for the column, as determined by any column configuration. |

### `<columnName>`

- default: The cell content as text.

Provides the ability to override the display for a particular column, by its key from the original data. Provided to the slot are the content of the cell itself, as well as the rest of its row, allowing cells to be combined where necessary.

| Slot prop | Type   | Description                                              |
| --------- | ------ | -------------------------------------------------------- |
| `cell`    | string | The original content of the cell, as provided in `data`. |
| `row`     | object | The content of the entire row that the cell belongs to.  |

### `select-all-rows-label`

- default: "Select all rows"

The hidden label for the "select" checkbox that represents all rows.

### `select-row-label`

- default: "Select row"

The hidden label for each "select" checkbox, used when `enableSelection` is true.

| Slot prop   | Type   | Description                                  |
| ----------- | ------ | -------------------------------------------- |
| `row`       | object | The data for the current row.                |
| `rowNumber` | number | The 1-based position of the row in the list. |

### `configure-label`

- default: "Configure"

The label for the "Configure" dropdown, including display options and column visibility.

### `display-options-label`

- default: "Display options"

The label for the "Display" options in the configure dropdown.

### `display-option-compact-label`

- default: "Compact"

The label for the "Compact" display option.

### `display-option-standard-label`

- default: "Standard"

The label for the "Standard" display option.

### `display-option-relaxed-label`

- default: "Relaxed"

The label for the "Relaxed" display option.

### `column-visibility-label`

- default: "Columns"

The label for the "Columns" options in the configure dropdown.

### `sort-status`

- default: "Sorted by {column} ascending/descending"

The screen-reader-only announcement made when the table is sorted. Rendered inside a `role="status"` live region.

| Slot prop   | Type    | Description                                     |
| ----------- | ------- | ----------------------------------------------- |
| `column`    | string  | The label of the column currently being sorted. |
| `ascending` | boolean | Whether the column is sorted ascending.         |

### `search-status`

- default: "Showing {count} result(s) for "{query}"" / "No results for "{query}""

The screen-reader-only announcement made when the search results change. Rendered inside a `role="status"` live region.

| Slot prop | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| `count`   | number | The number of results found. |
| `query`   | string | The current search query.    |

### `selection-status`

- default: "{selectedCount} of {total} rows selected" / "All {total} rows selected" / "All rows deselected"

The screen-reader-only announcement made when the row selection changes. Only active when `enableSelection` is enabled. Rendered inside a `role="status"` live region.

| Slot prop       | Type    | Description                                        |
| --------------- | ------- | -------------------------------------------------- |
| `selectedCount` | number  | The number of rows currently selected.             |
| `total`         | number  | The total number of rows available for selection.  |
| `allSelected`   | boolean | Whether all available rows are currently selected. |

### `selected-row-count-label`

- default: "${selectedCount} rows selected"

The label for the number of rows currently selected. This is only shown if `enableSelection` is enabled.

| Slot prop       | Type   | Description                           |
| --------------- | ------ | ------------------------------------- |
| `selectedCount` | string | The count of rows currently selected. |

### `page-number-label`

The label for each individual page number button in the pagination controls.

| Slot prop | Type   | Description      |
| --------- | ------ | ---------------- |
| `page`    | number | The page number. |

### `next-page-label`

The label for the "next page" button in the pagination controls.

### `showing-items-label`

- default: `Showing {{ first }}&ndash;{{ last }} of {{ total }} items`

A display of the current items being shown, giving the user an indication of where they are in the list.

| Slot prop | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| `first`   | number | The first item being displayed.        |
| `last`    | number | The last item being displayed.         |
| `count`   | number | The total number of items in the list. |

## Props

### `data`

- type: `array`
- default: `[]`

An array of objects containing the data to display in the table. Each object represents a single row, containing a key for each column of the table, which itself contains the content for that column.

### `columns`

- type: `object`
- default: `{}`

Any additional configuration for columns. **Note:** Any column without configuration will not be displayed. This is to make it easier to hide unnecessary columns, and to help enforce proper labelling of column data.

#### Available configuration keys

| Key                         | Type                | Default | Description                                                                                                                                                          |
| --------------------------- | ------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                     | `string`            | `""`    | The label to display in the column header.                                                                                                                           |
| `hidden`                    | `boolean`           | `false` | Whether this column is hidden, allowing hidden columns to be more explicitly defined where helpful.                                                                  |
| `searchable`                | `boolean`           | `true`  | Whether this column is included in searches. If false, search will ignore this column entirely.                                                                      |
| `searchCallback`            | `function`          | `null`  | A custom search matcher to apply when searching this column. Given the `searchQuery`, `columnKey`, `cell` and `row`, returns `true` for a matching search.           |
| `searchableContentCallback` | `function`          | `null`  | Provides custom searchable content for this column. Given the `columnKey` and `rowData`, returns a string to use instead of the cell content.                        |
| `sortable`                  | `boolean`           | `true`  | Whether this column can be sorted.                                                                                                                                   |
| `sortableContentCallback`   | `function`          | `null`  | Provides custom sortable content for this column. Given the `columnKey` and `rowData`, returns a string to use instead of the cell content.                          |
| `align`                     | `string`            | `left`  | The alignment of the column. Anything but "right" will be treated as "left".                                                                                         |
| `primary`                   | `boolean`           | `false` | Whether this is the primary column. Primary cells render as `<th scope="row">` rather than `<td>`, which helps screen readers associate row headers with their data. |
| `headingClasses`            | `Vue class binding` | `""`    | Classes to apply only to this column's heading.                                                                                                                      |
| `cellClasses`               | `Vue class binding` | `""`    | Classes to apply only to this column's cells.                                                                                                                        |
| `columnClasses`             | `Vue class binding` | `""`    | Classes to apply to both this column's heading and cells.                                                                                                            |
| `tabularNums`               | `boolean`           | `false` | Whether to apply tabular number formatting (`tabular-nums`) to cells in this column. Useful for numeric columns to ensure digits align vertically.                   |

### `name`

- type: `string`
- default: `null`

A unique name for this table. This will be used to store the user's preferences for how dense the table is, for example. Without a name, this option will not be available. The name will be used directly in `localStorage`, prefixed with `data-table:`, so should be safe for users.

### `enableSearch`

- type: `boolean`
- default: `true`

Whether to enable the table search. When enabled, anything typed into the search box will search the text for each cell case-insensitively, and hide any rows where none of the cells match.

### `enableSort`

- type: `boolean`
- default: `true`

Whether to enable the table sort. When enabled, columns marked as sortable (the default) can be ordered ascending or descending.

### `enableSelection`

- type: `boolean`
- default: `false`

Whether to enable selection. When enabled, a new column is added to the start of the table to include selection checkboxes, and v-model on the table returns the selected rows' data.

### `searchPlaceholder`

- type: `string`
- default: `null`

The placeholder to apply to the search input.

### `headingClasses`

- type: `string`
- default: `font-bold text-grey-700 dark:text-white/60`

Additional classes to apply to all headings in the table, merged with any column-level `headingClasses`. Cell padding will always apply.

### `cellClasses`

- type: `string`
- default: `text-sm text-grey-800 dark:text-grey-100`

Additional classes to apply to all standard cells in the table, merged with any column-level `cellClasses`. Cell padding will always apply.

## Methods

### `setSearchQuery`

Set the table's current search query, overriding any current search. This could be used in conjunction with a cell template to allow the user to find all similar rows, for example.

| Parameter     | Type   | Description                  |
| ------------- | ------ | ---------------------------- |
| `searchQuery` | string | The new search query to set. |

## Styling hooks

| Attribute                     | Element | Notes                          |
| ----------------------------- | ------- | ------------------------------ |
| `data-component="data-table"` | Root    | Scope styles to this component |

## Examples

### Basic table

```html
<data-table v-bind="{ data }" />
```

### Cell overrides

```html
<data-table v-bind="{ data }">
	<template #title="{ cell }">
		<span class="flex items-center gap-2">
			<icon-film />
			{{ cell }}
		</span>
	</template>
</data-table>
```
