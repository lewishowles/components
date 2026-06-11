# `donut-chart`

Create a donut chart from a set of segments. The chart automatically determines proportions based on the total.

A `label` slot is required. Use the `description` slot for additional context about the chart's findings.

## Slots

### `label`

A label describing the chart as a whole. Required.

### `description`

Additional context about the chart's findings. Use this to describe trends rather than repeating the label.

## Props

### `segments`

- type: `array`
- default: `[]`

The segments to display. Each entry should have a `value` and an optional `label`. If any value is not a number, or is negative, no chart will be generated. The `label` is used in the accessible table output.

## Styling hooks

| Attribute                      | Element           | Notes                          |
| ------------------------------ | ----------------- | ------------------------------ |
| `data-component="donut-chart"` | SVG chart element | Scope styles to this component |

## Examples

### Basic chart

```html
<donut-chart v-bind="{ segments }">
	<template #label>Sales by region</template>
</donut-chart>
```

```js
const segments = [
	{ label: "North", value: 5 },
	{ label: "South", value: 4 },
	{ label: "East", value: 3 },
	{ label: "West", value: 2 },
	{ label: "Central", value: 1 },
];
```

### With description

```html
<donut-chart v-bind="{ segments }">
	<template #label>Sales by region</template>
	<template #description>Northern region leads with 33%, followed by Southern at 27%.</template>
</donut-chart>
```
