# `searchable-list`

Provided an array, `searchable-list` provides a search box to filter those items. The list of results is provided to the default slot, meaning they can be displayed however best suits the implementation.

If no search is being performed, the whole list is returned.

By default, each item is searched directly. Each property of an object is recursively, case-insensitively searched, and individual properties can be excluded via the `exclude` prop. Alternatively, only certain properties can be included via the `include` prop. If the displayed item and searchable content should differ, use the `search` prop to map each item to the value that should be searched.

### `v-model`

The current search query will be available via `v-model`.

## Slots

### `default`

The main "results" display.

| Slot prop          | Type      | Description                                                                                          |
| ------------------ | --------- | ---------------------------------------------------------------------------------------------------- |
| `items`            | `array`   | The list of items matching any current search options, or all items if no search is being performed. |
| `query`            | `string`  | The current search query.                                                                            |
| `performingSearch` | `boolean` | Whether a search is currently being performed.                                                       |
| `haveResults`      | `boolean` | Whether the current query has results.                                                               |
| `resultCount`      | `number`  | The number of results found.                                                                         |
| `itemCount`        | `number`  | The total number of items provided.                                                                  |

### `label`

The search input label, giving the user an idea of what they are searching.

### `results-count`

A slot to override the default results count display, appearing beneath the search box.

| Slot prop          | Type      | Description                                    |
| ------------------ | --------- | ---------------------------------------------- |
| `performingSearch` | `boolean` | Whether a search is currently being performed. |
| `resultCount`      | `number`  | The number of results found.                   |
| `itemCount`        | `number`  | The total number of items provided.            |
| `query`            | `string`  | The current search query.                      |

### `no-results`

A slot to override the default no-results display.

| Slot prop | Type     | Description               |
| --------- | -------- | ------------------------- |
| `query`   | `string` | The current search query. |

### `reset-search-label`

The label for the reset search button.

## Props

### `data`

- type: `array`
- **required**

The list of items to search, or display if no search is being performed.

### `search`

- type: `function`
- default: `item => item`

A function used to map each item to the content that should be searched. This allows the displayed item and the searchable content to differ.

### `placeholder`

- type: `string`
- default: `null`

Any placeholder to provide to the search input. This can be used to indicate the kinds of data the user can search for.

### `exclude`

- type: `array`
- default: `null`

The list of object properties that should not be included in the search.

### `include`

- type: `array`
- default: `null`

The list of object properties that should be searched exclusively.

## Methods

### `resetSearch`

Resets the current search query for the user.

### `triggerFocus`

Trigger focus on the search input.

## Styling hooks

| Attribute                          | Element | Notes                          |
| ---------------------------------- | ------- | ------------------------------ |
| `data-component="searchable-list"` | Root    | Scope styles to this component |

## Examples

### Basic searchable list

```js
const data = [{ id: "123", name: "Lewis" }];
```

```html
<searchable-list v-bind="{ data }">
	<template #label> Search users by name </template>

	<template #default="{ items }">
		<ul>
			<li v-for="item in items" :key="item.id">{{ item.name }}</li>
		</ul>
	</template>
</searchable-list>
```
