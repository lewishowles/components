# `form-checkbox`

`form-checkbox` is an extension of the standard `input[type="checkbox"]`, with a consistent design and baked-in accessibility features.

Supports `v-model` to bind the input's current value.

## Slots

### `default`

The default slot contains the label of the checkbox, which appears beside it.

### `error`

Any error text to display below the input.

### `help`

Any help text to display below the input.

## Props

### `id`

- type: `string`
- default: `null`

Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

### `inputAttributes`

- type: `string`
- default: `null`

Any additional attributes to pass to the input itself, such as `required`.

## Methods

### `triggerFocus`

Focus this input.

## Examples

### Basic usage

```html
<form-checkbox v-model="termsAccepted">
	By submitting this form, you accept our <link-tag v-bind="{ external: true }">terms and conditions of sale</link-tag>.
</form-checkbox>
```

### With help

```html
<form-checkbox v-model="preferCustomSetup">
	Use advanced setup

	<template #help>
		Advanced setup lets you customise the behaviour of your store right away. These options are always available later in the Preferences menu.
	</template>
</form-checkbox>
```
