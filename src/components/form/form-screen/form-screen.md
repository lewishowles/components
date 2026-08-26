# `form-screen`

A single `form-screen` contains the fields and any other content for a single screen in a `form-flow`. Only one screen is visible at any one time.

## Props

### `id`

- type: `string`
- **required**

A unique identifier used to register this screen to the active `form-flow`.

### `autoAdvance`

- type: `string`
- default: `undefined`

If a field name is provided, the screen automatically advances when that field's value changes and successfully validates. Initial model data and programmatic updates do not trigger this progression.

### `autoFocus`

- type: `string`
- default: `undefined`

If a field name is provided, that field is focused when the screen becomes active. The error summary receives focus first if it is showing. Otherwise, the named field receives focus if it is registered. If not, the screen title receives focus.

## Slots

### `title`

The heading for this screen.

### `introduction`

Optional introductory content for this screen.

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

### Focus a field when a screen becomes active

Pass a field name when a screen needs a more specific focus target.

```html
<form-flow>
	<form-screen id="contact">
		<form-field type="email" name="email">Email address</form-field>
	</form-screen>

	<form-screen id="profile" auto-focus="name">
		<form-field name="name">Display name</form-field>
	</form-screen>
</form-flow>
```
