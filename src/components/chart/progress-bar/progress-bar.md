# `progress-bar`

Display the progress of an action. Progress is calculated as a percentage based on `current`, `min`, and `max` values.

## Props

### `current`

- type: `number`
- default: `0`

The current value represented by the progress bar.

### `min`

- type: `number`
- default: `0`

The minimum value, used to determine bar fill.

### `max`

- type: `number`
- default: `100`

The maximum value, used to determine bar fill.

### `label`

- type: `string`
- default: `Loading…`

The progress label. Hidden by default but available for accessibility.

### `showLabel`

- type: `boolean`
- default: `false`

Show the label to the user.

### `showValue`

- type: `boolean`
- default: `false`

Show the value to the user, formatted as a percentage.

### `trackClasses`

- type: `Vue class binding`
- default: `h-4 rounded-full bg-grey-200`

Classes to apply to the track (background).

### `barClasses`

- type: `Vue class binding`
- default: `h-full rounded-full bg-purple-700`

Classes to apply to the bar (fill).

## Slots

### `default`

Provide a custom label. Only rendered when `showLabel` is true.

### `value`

Override the default percentage display. Only rendered when `showValue` is true.

| Slot prop | Type | Description |
| --- | --- | --- |
| `current` | `number` | The current value. |
| `percentage` | `number` | The calculated percentage (0–100). |

## Examples

### Default range

```html
<progress-bar v-bind="{ current: 30 }" />
```

### Custom range

```html
<progress-bar v-bind="{ current: 30, min: 20, max: 40 }" />
```

### With label and value

```html
<progress-bar v-bind="{ current: 75, showLabel: true, showValue: true }">
	<template #default>
		Processing…
	</template>
	<template #value="{ percentage }">
		{{ percentage }}% done
	</template>
</progress-bar>
```
