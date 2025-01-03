# `data-table`

...

## Slots

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

## Props

### `data`

- type: `array`
- default: `[]`

### `columns`

- type: `object`
- default: `{}`

Any additional configuration for columns. **Note:** Any column without configuration will not be displayed. This is to make it easier to hide unnecessary columns, and to help enforce proper labelling of column data.

#### Available configuration keys

|Key|Type|Default|Description|
|-|-|-|-|
|`label`|`string`|""|The label to display in the column header.|
|`hidden`|`boolean`|false|Whether this column is hidden, allowing hidden columns to be more explicitly defined where helpful.|
|`headingClasses`|`string`|""|Classes to apply only to this column's heading.|
|`cellClasses`|`string`|""|Classes to apply only to this column's cells.|
|`columnClasses`|`string`|""|Classes to apply to both this column's heading and cells.|

### `enableSearch`

- type: `boolean`
- default: `true`

Whether to enable the table search. When enabled, anything typed into the search box will search the text for each cell case-insensitively, and hide any rows where none of the cells match.

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

## Events

### `@click`

...

## Methods

### `method`

...

## Examples

### Basic table

```html
<data-table v-bind="{ data }">
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

- Searching:
  - Add "searchable" string / null prop to column configuration
- Add table title / intro
- Allow custom search data for column value (via callback, given column key and row data)
- Add options for changing the table layout (compact, normal, relaxed etc), remembering those choices for the table
- Allow sorting of columns
- Add custom sort data for column value (via callback, given column key and row data)
- Add options for turning columns on and off, and remembering those choices for the table
- Allow selecting of columns, model of selected columns with their row data (so that you can access IDs etc)
