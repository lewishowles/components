# `data-table`

`data-table` can display complex data with minimal effort. From hiding columns to controlling their order, managing data is simple and means that the minimum amount of data manipulation needs to be done beforehand.

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

#### Slot props

##### `searchQuery`

- type: `string`

The current search term entered by the user.

### `<columnName>_heading`

- default: The heading provided within `configuration`, or the column key.

Provides the ability to override the label for a particular column, by its key from the original data. Provided to the slot are is the key for that column.

#### Slot props

##### `key`

- type: `string`

The key for this column, as determined by the original data provided.

##### `label`

- type: `string`

The current label for the column, as determined by any column configuration.

### `<columnName>`

- default: The cell content as text.

Provides the ability to override the display for a particular column, by its key from the original data. Provided to the slot are the content of the cell itself, as well as the rest of its row, allowing cells to be combined where necessary.

#### Slot props

##### `cell`

- type: `string`

The original content of the cell, as provided in `data`.

##### `row`

- type: `object`

The content of the entire row that the cell belongs to.

### `display-options-label`

- default: Display options

The label for the "Display" options dropdown.

### `display-option-compact-label`

- default: Compact

The label for the "Compact" display option.

### `display-option-standard-label`

- default: Standard

The label for the "Standard" display option.

### `display-option-relaxed-label`

- default: Relaxed

The label for the "Relaxed" display option.

## Props

### `data`

- type: `array`
- default: `[]`

An array of objects containing the data to display in the table. Each object should match and represents a single row, containing a key for each column of the table, which itself contains the content for that column.

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
|`headingClasses`|`string`|`""`|Classes to apply only to this column's heading.|
|`cellClasses`|`string`|`""`|Classes to apply only to this column's cells.|
|`columnClasses`|`string`|`""`|Classes to apply to both this column's heading and cells.|

### `name`

- type: `string`
- default: `null`

A unique name for this table. This will be used to store the user's preferences for how dense the table is, for example. Without a name, this option will not be available. The name will be used directly in `localStorage`, prefixed with `data-table:`, so should be safe to be viewed by users.

### `enableSearch`

- type: `boolean`
- default: `true`

Whether to enable the table search. When enabled, anything typed into the search box will search the text for each cell case-insensitively, and hide any rows where none of the cells match.

### `searchableContentCallback(columnKey, rowData)`

- type: `function`
- default: `null`

If defined, this method is called with a `columnKey` for the current column, and `rowData` for the current row. This method is called as the table is building up its internal content. If the method returns a string, this is used as the searchable content for that column in that row, **overriding** the content of the cell. If anything else is returned, such as undefined, the original content is used instead. In both cases, the searchable content is lower-cased.

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

## To do

- Allow sorting of columns
- Add options for turning columns on and off, and remembering those choices for the table
- Allow selecting of columns, model of selected columns with their row data (so that you can access IDs etc)
