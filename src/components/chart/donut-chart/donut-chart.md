# `donut-chart`

Create a donut chart from a set of values. The chart automatically determines proportions based on the total.

A `label` slot is required. Use the `description` slot for additional context about the chart's findings.

## Slots

### `label`

A label describing the chart as a whole. Required.

### `description`

Additional context about the chart's findings. Use this to describe trends rather than repeating the label.

## Props

### `values`

- type: `array`
- **required**

The values to display. If any value is not a number, or is negative, no chart will be generated.

### `colourful`

- type: `boolean`
- default: `false`

Whether to use the brighter set of chart colours. Use with caution; adjacent slices may not be sufficiently distinct depending on the number of segments.

## Examples

### Basic chart

```html
<donut-chart v-bind="{ values: [5, 4, 3, 2, 1] }">
	<template #label> Sales by region </template>
</donut-chart>
```

### With description

```html
<donut-chart v-bind="{ values: [5, 4, 3, 2, 1] }">
	<template #label> Sales by region </template>
	<template #description> Northern region leads with 33%, followed by Southern at 27%. </template>
</donut-chart>
```
