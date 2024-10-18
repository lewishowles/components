# `progress-bar`

...

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

### `trackClasses`

- type: `string | array | object`
- default: `h-4 rounded-full bg-grey-200`

Classes to apply to the track, which is the background behind the bar.

### `barClasses`

- type: `string | array | object`
- default: `h-full rounded-full bg-purple-700`

Classes to apply to the bar, which indicates the current value.

### `label`

- type: `string`
- default: `Loading…`

The label for the progress bar. This label is hidden by default, but is included for accessibility purposes.

## Examples

### Using the default range

```html
<progress-bar v-bind="{ value: 30 }" />
```

### Using a custom range

```html
<progress-bar v-bind="{ value: 30, min: 20, max: 40 }" />
```
