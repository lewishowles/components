# `form-select`

`form-select` is an extension of the standard `select` tag, with a consistent design and baked-in accessibility features.

## Model

The model value is the current value of the field.

## Slots

### `default`

The default slot contains the label of the field.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `introduction`

Any additional text to introduce this input, which appears between the label and the input.

### `error`

Any error text to display below the field.

### `help`

Any help text to display below the field.

## Props

### `options`

- type: `array`
- default: `[]`

The options for this select can be provided in a number of formats for ease.

- An array of strings `["option1", "option2", "option3"]`, in which case both the label and value are the same.
- An array of numbers `[1, 2, 3]`, in which case both the label and value are the same.
- An object `{ value: "label" }` where each key is the value of oan option, and each value is the label.
- An array of objects `[{ label: "Label", value: "value" }]` where labels and values are explicitly defined.

It is possible to combine both array options, but generally not recommended.

### `allowEmpty`

- type: `boolean`
- default: `true`

Whether to allow an empty option, the label of which can be provided via the `empty-option-label` slot.

### `id`

- type: `string`
- default: `null`

Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

### `inputAttributes`

- type: `string`
- default: `null`

Any additional attributes to pass to the field itself, such as `required`.

## Methods

### `triggerFocus`

Focus this select.

## Examples

### Basic usage

```html
<form-select v-model="mode" v-bind="{ options }">
	Design mode
</form-select>
```

### With help

```html
<form-select v-model="mode" v-bind="{ options }">
	Design mode

	<template #help>
		The design mode will control what options appear by default. You can change this at any time.
	</template>
</form-select>
```
