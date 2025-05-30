# `loading-indicator`

`loading-indicator` provides a consistent loading notice and animation when data is pending.

## Slots

### `default`

The default slot contains the text to display beside the loading indicator.

_Note that no default text is provided because it is recommended to be clear about what is happening, and what is loading, instead of using a generic message._

## Props

### `large`

- type: `boolean`
- default: `false`

Whether to display a larger, vertical version of the indicator.

## Examples

### Basic indicator

```html
<loading-indicator>
	Loading data…
</loading-indicator>
```
