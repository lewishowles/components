# `form-screen`

A single `form-screen` contains the fields and any other content for a single screen in a `form-flow`. Only one screen is visible at any one time.

## Props

### `id`

- type: `string`
- **required**

A unique identifier used to register this screen to the active `form-flow`.

## Slots

### `default`

Any fields and other content shown while this screen is active.

## Styling hooks

| Attribute                      | Element | Notes                          |
| ------------------------------ | ------- | ------------------------------ |
| `data-component="form-screen"` | Root    | Scope styles to this component |
| `data-screen-id`               | Root    | The registered screen ID       |

## Examples

### Basic usage

```html
<form-flow>
	<form-screen id="contact">
		<form-field type="email" name="email">Email address</form-field>
	</form-screen>
</form-flow>
```
