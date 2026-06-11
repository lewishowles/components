# `chart-legend`

Display a legend for a chart, pairing each series entry's colour swatch, label, and optional value. Designed to work alongside `useChartConfig`, which expands raw segments with the library's chart palette.

## Props

### `series`

- type: `Array`
- default: `[]`

The series to display. Each entry should have `label`, `value`, and `color` properties. Typically produced by `useChartConfig`.

### `showValues`

- type: `Boolean`
- default: `true`

Whether to show the value alongside each label.

### `formatValue`

- type: `Function`
- default: `undefined`

A callback to format each value for display. Receives the raw value and returns a string. Falls back to the raw value when not provided.

### `orientation`

- type: `String`
- default: `"vertical"`
- options: `"horizontal"`, `"vertical"`

Whether to lay entries out in a row or a column.

## Styling hooks

| Attribute                       | Element | Notes                          |
| ------------------------------- | ------- | ------------------------------ |
| `data-component="chart-legend"` | Root    | Scope styles to this component |
| `data-part="entry"`             | `<div>` | Each label/value pair          |
| `data-part="label"`             | `<dt>`  | Label and colour swatch        |
| `data-part="value"`             | `<dd>`  | Formatted value                |

## Examples

### Basic usage

```html
<chart-legend v-bind="{ series }" />
```

```js
const segments = [
	{ label: "Revenue", value: 42 },
	{ label: "Costs", value: 18 },
];

const { series } = useChartConfig(segments);
```

### With formatted values

```html
<chart-legend v-bind="{ series, formatValue: (v) => `£${v.toLocaleString()}` }" />
```

### Vertical orientation

```html
<chart-legend v-bind="{ series, orientation: 'vertical' }" />
```
