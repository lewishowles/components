# `progress-bar`

Display the progress of an action, with appropriate accessible labelling.

Currently, progress is assumed to be a percentage, based on the minimum, maximum and current values.

## Props

### `value`

- type: `number`
- default: `0`

The current value represented by the progress bar.

### `min`

- type: `number`
- default: `0`

The minimum value of the progress bar, used to determine how much of the bar is filled based on the current value.

### `max`

- type: `number`
- default: `100`

The maximum value of the progress bar, used to determine how much of the bar is filled based on the current value.

### `label`

- type: `string`
- default: `Loading…`

The label for the progress bar. This label is hidden by default, but is included for accessibility purposes.

### `showLabel`

- type: `boolean`
- default: `false`

Whether to show the label to the user.

### `showValue`

- type: `boolean`
- default: `false`

Whether to show the value to the user, formatted as a percentage.

### `trackClasses`

- type: `string | array | object`
- default: `h-4 rounded-full bg-grey-200`

Classes to apply to the track, which is the background behind the bar.

### `barClasses`

- type: `string | array | object`
- default: `h-full rounded-full bg-purple-700`

Classes to apply to the bar, which indicates the current value.

## Slots

### `default`

When the label is shown, the default slot can be used to provide a custom label that cannot be provided via the `label` prop.

### `value`

When the value is shown, override the default value display.

| Slot prop | Type | Description |
| --- | --- | --- |
| `value` | `number` | The current value of the progress bar. |

## Examples

### Using the default range

```html
<progress-bar v-bind="{ value: 30 }" />
```

### Using a custom range

```html
<progress-bar v-bind="{ value: 30, min: 20, max: 40 }" />
```
