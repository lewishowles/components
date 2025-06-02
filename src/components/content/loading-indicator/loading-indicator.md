# `loading-indicator`

`loading-indicator` provides a consistent loading notice and animation when data is pending.

## Slots

### `default`

The default slot contains the text to display beside the loading indicator.

_Note that no default text is provided by design. Using a specific message related to what is loaded is strongly encouraged._

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
