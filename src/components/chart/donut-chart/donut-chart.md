# `donut-chart`

Create a donut chart from a set of values. The chart will automatically determine the percentages for each of the figures based on the total.

Note that when creating a chart, it is imperative to provide some kind of alternative for those who cannot see the chart.

## Props

### `values`

- type: `array`
- **required**

The values to display in the chart. If any values are not a number, or is negative, no chart will be generated.

### `colourful`

- type: `boolean`
- default: `false`

Whether to use the brighter set of chart colours. Use with caution, as depending on the number of slices, adjacent slices may not be sufficiently distinct.

## Examples

### Basic button

```html
<donut-chart v-bind="{ values: [5, 4, 3, 2, 1] }" />
```
