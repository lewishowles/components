# `combo-box`

`combo-box` pairs a search input with a list of results, handling the keyboard, ARIA, and open/close behaviour of the combobox interaction pattern on top of the [`useCombobox`](/composables/use-combobox) composable. Arrow keys move through the results, `Enter` chooses the highlighted one, and `Escape` closes the list.

It deliberately does not filter. You pass the already-matched `items` and render each one through the default slot, so matching and ordering stay with whoever owns the data. This keeps the component agnostic to what each result is, which makes it well suited to a command menu fed by several sources — vehicles, users, pages — each matching itself before the results are combined into one list.

Choosing a result emits it through the `select` event.

### `v-model`

The search text is available via `v-model`. Nothing is chosen until the user activates a result, so the query is the only model. Bind it to drive your own filtering.

## Slots

### `default`

Renders the content of each result.

| Slot prop     | Type      | Description                                    |
| ------------- | --------- | ---------------------------------------------- |
| `item`        | `*`       | The original item, exactly as you provided it. |
| `highlighted` | `boolean` | Whether this result is currently highlighted.  |

### `label`

The input's label, describing what the user is searching.

### `introduction`

Supporting text shown beneath the label.

### `no-results`

Replaces the message shown when there are no results for the current query.

| Slot prop | Type     | Description               |
| --------- | -------- | ------------------------- |
| `query`   | `string` | The current search query. |

### `loading`

Replaces the message shown while results are loading.

## Props

### `items`

- type: `array`
- default: `[]`

The results to display, already matched and ordered by the caller. Each item is rendered through the default slot and emitted as-is when chosen. Results may be merged from several sources without their IDs needing to be unique — each is tracked by its position in the list.

### `loading`

- type: `boolean`
- default: `false`

Whether results are currently loading. While loading, a message is shown in place of the results.

### `id`

- type: `string`
- default: `null`

Any ID to apply to the input. If an ID is not provided, one is generated at random. When providing an ID, please make sure that it is unique.

### `placeholder`

- type: `string`
- default: `null`

Any placeholder to show in the input. This can hint at the kind of value the user is searching for.

### `placement`

- type: `string`
- default: `"below"`

Whether to open the results above or below the input. The list flips to the opposite side if it would clip the viewport edge.

### `align`

- type: `string`
- default: `"start"`

Whether to align the results to the start or end of the input. The list flips to the opposite side if it would clip the viewport edge.

### `dropdownClasses`

- type: `string | array | object`
- default: `null`

Additional classes to apply to the results list, merged on top of its base styles. Any provided classes that conflict with base classes will override as necessary.

## Events

### `select`

Emitted when the user chooses a result, with the original item as its payload.

## Methods

### `triggerFocus`

Move focus to the input.

## Styling hooks

| Attribute                    | Element | Notes                          |
| ---------------------------- | ------- | ------------------------------ |
| `data-component="combo-box"` | Root    | Scope styles to this component |

## Examples

### Single source

```js
const query = ref("");
const results = computed(() => matchPeople(query.value));
```

```html
<combo-box v-model="query" v-bind="{ items: results }" @select="goToPerson">
	<template #label>Search people</template>

	<template #default="{ item: person }">{{ person.name }}</template>
</combo-box>
```

### Command menu from several sources

Each source matches itself, and the menu only decides how the results combine.

```js
const query = ref("");

const vehicles = useVehicleSearch(query); // matches by registration
const users = useUserSearch(query); // matches by name and email
const pages = usePageSearch(query); // matches by title

const items = computed(() => [...vehicles.value, ...users.value, ...pages.value]);
```

```html
<combo-box v-model="query" v-bind="{ items }" @select="runCommand">
	<template #label>Quick search</template>

	<template #default="{ item }">
		<command-result v-bind="{ item }" />
	</template>
</combo-box>
```
