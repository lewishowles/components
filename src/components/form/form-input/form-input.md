# `form-input`

`form-input` is an extension of the standard `input` tag, with a consistent design and baked-in accessibility features.

## Slots

### `default`

The default slot contains the label of the field.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `optional-indicator`

Content shown after the label text when the field is not required. Defaults to `(optional)`.

### `introduction`

Any additional text to introduce this input, which appears between the label and the input.

### `prefix` and `suffix`

Any element—text or icon—to place at the start or end of the field.

You can find [the list of available icons in this project](/src/components/icon/icon.md)

### `error`

Any error text to display below the field.

### `help`

Any help text to display below the field.

## Props

### `id`

- type: `string`
- default: `null`

Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

### `placeholder`

- type: `string`
- default: `null`

Any placeholder to show in the field. Do not use a placeholder for critical information. Always use the label and help text as priorities.

### `inputAttributes`

- type: `string`
- default: `null`

Any additional attributes to pass to the field itself, such as `required` or `autocomplete`. This can also be used to change the type of the field, such as to `email`.

### `suggestions`

- type: `string[]`
- default: `null`

A list of suggestions to offer to the user as they type, rendered as a native `<datalist>` linked to the input. The user can select a suggestion or ignore it and enter a different value entirely.

## Events

### `v-model`

The current value of the form field will be available via `v-model`.

## Methods

### `triggerFocus`

Focus this input.

## Styling hooks

| Attribute                     | Element         | Notes                               |
| ----------------------------- | --------------- | ----------------------------------- |
| `data-component="form-input"` | Root            | Scope styles to this component      |
| `data-invalid`                | Root            | Present when the field has an error |
| `data-part="field-wrapper"`   | Input container | Wraps the `<input>` element         |

## Examples

### Basic usage

```html
<form-input v-model="username">Username</form-input>
```

### With icon

```html
<form-input v-model="username">
	Username

	<template #prefix>
		<icon-user />
	</template>
</form-input>
```

### With help

```html
<form-input v-model="username">
	Username

	<template #help>Your username will be displayed on your public profile.</template>
</form-input>
```
