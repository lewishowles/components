# `searchable-list`

Provided an array of objects, `searchable-list` provides a search box to filter those objects. The list of results is provided to the default slot, meaning they can be displayed however best suits the implementation.

If no search is being performed, the whole list is returned.

Each property of an object is recursively, case-insensitively searched, and individual properties can be excluded via the `exclude` prop. Alternatively, only certain properties can be included via the `include` prop.

## Slots

### `default`

The main "results" display.

| Slot prop | Type | Description |
|-|-|-|
| `items` | `array` | The list of items matching any current search options, or all items if no search is being performed. |
| `query` | `string` | The current search query. |

### `label`

The search input label, giving the user an idea of what they are searching.

### `results-count`

A slot to override the default results count display, appearing beneath the search box.

| Slot prop | Type | Description |
|-|-|-|
| `performingSearch` | `boolean` | Whether a search is currently being performed. |
| `resultCount` | `number` | The number of results found. |
| `itemCount` | `number` | The total number of items provided. |

### `reset-search-label`

The label for the reset search button.

## Props

### `data`

- type: `array`
- **required**

The list of items to search, or display if no search is being performed. This should be an array of objects. Any non-object entries will be ignored.

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

## Examples

### Basic searchable list

```js
const data = [{ id: "123", name: "Lewis" }];
```

```html
<searchable-list v-bind="{ data }">
	<template #label>
		Search users by name
	</template>

	<template #default="{ items }">
		<ul>
			<li v-for="item in items" :key="item.id">
				{{ item.name }}
			</li>
		</ul>
	</template>
</searchable-list>
```
