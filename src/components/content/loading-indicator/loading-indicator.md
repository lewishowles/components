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

### `spinnerClasses`

- type: `string` | `array` | `object`
- default: `null`

Additional classes to apply to the spinner, merged on top of any size set by `large`. Any provided classes that conflict with base classes will override as necessary.

## Styling hooks

| Attribute                            | Element | Notes                                |
| ------------------------------------ | ------- | ------------------------------------ |
| `data-component="loading-indicator"` | Root    | Scope styles to this component       |
| `data-large`                         | Root    | Present when the `large` prop is set |

## Examples

### Basic indicator

```html
<loading-indicator>Loading data…</loading-indicator>
```
