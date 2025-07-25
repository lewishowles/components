# `data-table`

`data-table` can display complex data with minimal effort. From hiding columns to controlling their order, managing data is simple and means that the minimum amount of data manipulation needs to be done beforehand.

When it comes to whether to format data before passing it to the table, versus formatting it using cell templates, the latter is recommended. If the data is passed to the table in a more raw form, it may be easier for a table to be sortable out of the box (for example, with integers versus formatted currency strings). You then have ultimate control over formatting for each cell, in a way that's more flexible than passing pre-formatted data through.

## Slots

### `table-title`

Any title to display with this table.

### `table-introduction`

Any introduction to display with this table.

### `search-label`

The label to use for the search box.

### `reset-search-label`

- default: "Reset search"

The label to use for the "Reset search" button.

### `no-data-message`

- default: "No data to display."

The message to display when no data could be found for the table.

### `no-results-message`

- default: "No results could be found for term &lt;span class="font-bold"&gt;"{{ searchQuery }}"&lt;/span&gt;."

The message to display when no data could be found for the current search term.

| Slot prop | Type | Description |
| --- | --- | --- |
| `searchQuery` | `string` | The current search query in the table. |

### `<columnName>_heading`

- default: The heading provided within `configuration`, or the column key.

Provides the ability to override the label for a particular column, by its key from the original data. Provided to the slot are is the key for that column.

| Slot prop | Type   | Description                                                                 |
|-----------|--------|-----------------------------------------------------------------------------|
| `key`     | string | The key for this column, as determined by the original data provided.        |
| `label`   | string | The current label for the column, as determined by any column configuration. |

### `<columnName>`

- default: The cell content as text.

Provides the ability to override the display for a particular column, by its key from the original data. Provided to the slot are the content of the cell itself, as well as the rest of its row, allowing cells to be combined where necessary.

| Slot prop | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| `cell`    | string | The original content of the cell, as provided in `data`. |
| `row`     | object | The content of the entire row that the cell belongs to.  |

### `select-all-rows-label`

- default: "Select all rows"

The hidden label for the "select" checkbox that represents all rows.

### `select-row-label`

- default: "Select row"

The hidden label for each "select" checkbox, used when `enableSelection` is true.

| Slot prop | Type   | Description                      |
|-----------|--------|----------------------------------|
| `row`     | object | The data for the current row.    |

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

### `selected-row-count-label`

- default: "${selectedCount} rows selected"

The label for the number of rows currently selected. This is only shown if `enableSelection` is enabled.

| Slot prop      | Type   | Description                        |
|----------------|--------|------------------------------------|
| `selectedCount`| string | The count of rows currently selected.|

### `showing-items-label`

- default: `Showing {{ first }}&ndash;{{ last }} of {{ total }} items`

A display of the current items being shown, giving the user an indication of where they are in the list.

| Slot prop | Type   | Description                        |
|-----------|--------|------------------------------------|
| `first`   | number | The first item being displayed.     |
| `last`    | number | The last item being displayed.      |
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

|Key|Type|Default|Description|
|-|-|-|-|
|`label`|`string`|`""`|The label to display in the column header.|
|`hidden`|`boolean`|`false`|Whether this column is hidden, allowing hidden columns to be more explicitly defined where helpful.|
|`searchable`|`boolean`|`true`|Whether this column is included in searches. If false, search will ignore this column entirely.|
|`sortable`|`boolean`|`true`|Whether this column can be sorted.|
|`align`|`string`|`left`|The alignment of the column. Anything but "right" will be treated as "left".|
|`headingClasses`|`string`|`""`|Classes to apply only to this column's heading.|
|`cellClasses`|`string`|`""`|Classes to apply only to this column's cells.|
|`columnClasses`|`string`|`""`|Classes to apply to both this column's heading and cells.|

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

### `searchableContentCallback(columnKey, rowData)`

- type: `function`
- default: `null`

If defined, this method is called with a `columnKey` for the current column, and `rowData` for the current row. This method is called as the table is building up its internal content. If the method returns a string, this is used as the searchable content for that column in that row, **overriding** the content of the cell. If anything else is returned, such as undefined, the original content is used instead.

### `sortableContentCallback(columnKey, rowData)`

- type: `function`
- default: `null`

If defined, this method is called with a `columnKey` for the current column, and `rowData` for the current row. This method is called as the table is building up its internal content. If the method returns a string, this is used as the sortable content for that column in that row, **overriding** the content of the cell. If anything else is returned, such as undefined, the original content is used instead.

The returned content is used in a `sort` method, so the returned content should make sense when sorted in that way.

### `searchPlaceholder`

- type: `string`
- default: `null`

The placeholder to apply to the search input.

### `headingClasses`

- type: `string`
- default: `text-left font-bold text-grey-950`

Classes to apply to all headings in the table. Cell padding will always apply.

### `cellClasses`

- type: `string`
- default: `text-grey-500`

Classes to apply to all standard cells in the table. Cell padding will always apply.

## Methods

### `setSearchQuery`

Set the table's current search query, overriding any current search. This could be used in conjunction with a cell template to allow the user to find all similar rows, for example.

| Parameter | Type | Description |
| --- | --- | --- |
| `searchQuery` | string | The new search query to set. |

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
