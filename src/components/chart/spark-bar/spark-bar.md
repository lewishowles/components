# `spark-bar`

Display a number within a range using a compact horizontal bar. Progress is calculated as a percentage based on `current`, `min`, and `max` values.

## Props

### `current`

- type: `number`
- default: `0`

The current value represented by the spark bar.

### `min`

- type: `number`
- default: `0`

The minimum value, used to determine bar fill.

### `max`

- type: `number`
- default: `100`

The maximum value, used to determine bar fill.

### `trackClasses`

- type: `Vue class binding`
- default: `h-1 rounded-full bg-grey-200 dark:bg-white/20`

Classes to apply to the track (background).

### `barClasses`

- type: `Vue class binding`
- default: `h-full rounded-full bg-purple-800 dark:bg-purple-300`

Classes to apply to the bar (fill).

### `valueClasses`

- type: `Vue class binding`
- default: `text-xs font-medium`

Classes to apply to the value display.

## Slots

### `default`

Provide custom content alongside the bar. Receives metric values and calculated percentage.

| Slot prop    | Type     | Description                        |
| ------------ | -------- | ---------------------------------- |
| `current`    | `number` | The current value.                 |
| `min`        | `number` | The minimum value.                 |
| `max`        | `number` | The maximum value.                 |
| `percentage` | `number` | The calculated percentage (0–100). |

The default slot output, when empty, displays `{{ percentage }}%`.

## Accessibility

The component uses `role="meter"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`. Provide an accessible name for the meter via the parent component using `aria-label` or `aria-labelledby`.

## Examples

### Basic usage

```html
<div aria-label="Storage used">
	<spark-bar v-bind="{ current: 81, max: 100 }" />
</div>
```

### With custom content

```html
<div aria-label="Storage">
	<spark-bar v-bind="{ current: 81, max: 100 }">
		<template #default="{ percentage }">
			{{ percentage }}%
			<span aria-hidden="true"> used</span>
		</template>
	</spark-bar>
</div>
```

### Custom range

```html
<div aria-label="Performance">
	<spark-bar v-bind="{ current: 35, min: 20, max: 40 }" />
</div>
```
