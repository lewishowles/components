# `form-input`

`form-input` is an extension of the standard `input` tag, with a consistent design and baked-in accessibility features.

Supports `v-model` to bind the input's current value.

## Slots

### `default`

The default slot contains the label of the input.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `error`

Any error text to display below the input.

### `help`

Any help text to display below the input.

## Props

### `id`

- type: `string`
- default: `null`

Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

### `placeholder`

- type: `string`
- default: `null`

Any placeholder to show in the input. Do not use a placeholder for critical information. Always use the label and help text as priorities.

### `inputAttributes`

- type: `string`
- default: `null`

Any additional attributes to pass to the input itself, such as `required` or `autocomplete`.

### `iconStart` and `iconEnd`

- type: `string`
- default: `null`

An icon to display at the start or end of a link.

The icon is implemented using `<component :is="...">`, allowing the link to use icons it doesn't explicitly import. To be used in this way, the icon must be globally registered. You can find [the list of available icons in this project](/src/components/icon/icon.md), or you can use one that is globally registered in your project.

_Note that `start` and `end` depend on the current document direction._

## Examples

### Basic usage

```html
<form-input v-model="username">
	Username
</form-input>
```

### With help

```html
<form-input v-model="username">
	Username

	<template #help>
		Your username will be displayed on your public profile.
	</template>
</form-input>
```
