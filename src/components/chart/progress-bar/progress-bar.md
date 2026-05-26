# `progress-bar`

Display the progress of an action. Progress is calculated as a percentage based on `current`, `min`, and `max` values. Pass `current: null` for an indeterminate state when the quantity is unknown.

## Props

### `current`

- type: `number | null`
- default: `0`

The current value. Pass `null` to render an indeterminate bar.

### `min`

- type: `number`
- default: `0`

The minimum value, used to determine bar fill.

### `max`

- type: `number`
- default: `100`

The maximum value, used to determine bar fill.

### `variant`

- type: `"progress" | "meter"`
- default: `"progress"`

The kind of progress bar. Use `"progress"` for tasks with a known endpoint (e.g. file upload or a multi-step wizard). Use `"meter"` for measurements within a fixed range (e.g. disk usage or battery level).

### `getValueLabel`

- type: `(value: number) => string`
- default: `null`

A function that receives the current value and returns a custom string for `aria-valuetext`. Use this in situations where providing a human-friendly description instead of the default percentage makes more sense, for example, `"3 of 10 files uploaded"`. Only called when the bar is not indeterminate.

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
- default: `h-full rounded-full bg-purple-800`

Classes to apply to the bar (fill). Applied to the indeterminate bar too.

## Slots

### `default`

Provide a custom label. Only rendered when `showLabel` is true.

### `value`

Override the default percentage display. Only rendered when `showValue` is true.

| Slot prop    | Type             | Description                        |
| ------------ | ---------------- | ---------------------------------- |
| `current`    | `number \| null` | The current value.                 |
| `percentage` | `number`         | The calculated percentage (0–100). |

## Examples

### Default range

```html
<progress-bar v-bind="{ current: 30 }" />
```

### Meter variant

```html
<progress-bar v-bind="{ current: 72, variant: 'meter' }"> Disk usage </progress-bar>
```

### Indeterminate

```html
<progress-bar v-bind="{ current: null }" />
```

### Custom aria-valuetext

```html
<progress-bar
	v-bind="{
		current: 3,
		max: 10,
		getValueLabel: value => `${value} of 10 files uploaded`,
	}"
/>
```

### With label and value

```html
<progress-bar v-bind="{ current: 75, showLabel: true, showValue: true }">
	<template #default> Processing… </template>
	<template #value="{ percentage }"> {{ percentage }}% done </template>
</progress-bar>
```
