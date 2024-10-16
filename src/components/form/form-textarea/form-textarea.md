# `form-textarea`

`form-textarea` is an extension of the standard `textarea` tag, with a consistent design and baked-in accessibility features.

Supports `v-model` to bind the textarea's current value.

## Slots

### `default`

The default slot contains the label of the textarea.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `error`

Any error text to display below the textarea.

### `help`

Any help text to display below the textarea.

## Props

### `id`

- type: `string`
- default: `null`

Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

### `placeholder`

- type: `string`
- default: `null`

Any placeholder to show in the textarea. Do not use a placeholder for critical information. Always use the label and help text as priorities.

### `inputAttributes`

- type: `string`
- default: `null`

Any additional attributes to pass to the textarea itself, such as `required` or `autocomplete`.

## Examples

### Basic usage

```html
<form-textarea v-model="biography">
	Biography
</form-textarea>
```

### With help

```html
<form-textarea v-model="biography">
	Biography

	<template #help>
		Your biography will be displayed on your public profile.
	</template>
</form-textarea>
```
