# `button-group`

`button-group` is an extension of [`form-radio-group`](../form-radio-group/form-radio-group.md), styled as a group of buttons.

Supports `v-model` to bind the currently selected item's value.

## Slots

### `default`

The default slot contains the label of the field.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `introduction`

Any additional text to introduce the options, which appears between the label and options.

### `error`

Any error text to display below the field.

### `help`

Any help text to display below the field.

## Props

### `options`

- type: `array|object`
- **required**

The options to display as buttons can be provided in one of a number of formats for ease.

- An array of strings `["option1", "option2", "option3"]`, in which case both the label and value are the same.
- An array of numbers `[1, 2, 3]`, in which case both the label and value are the same.
- An object `{ value: "label" }` where each key is the value of oan option, and each value is the label.
- An array of objects `[{ label: "Label", value: "value" }]` where labels and values are explicitly defined.

It is possible to combine both array options, but generally not recommended.

### `name`

- type: `string`
- default: `null`

A name for this button group. If not set, the input ID is used.

### `id`

- type: `string`
- default: `null`

Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

## Methods

### `triggerFocus`

Focus this button group.

## Examples

### Basic usage

```html
<button-group v-model="theme" v-bind="{ options }">
	Theme
</button-group>
```

```javascript
const options = [
	{ label: "System", value: "system" },
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
];
```

### With help

```html
<button-group v-model="accountType" v-bind="{ inline: true }">
	Account type

	<template #help>
		You can change the account type from the user screen later.
	</template>
</button-group>
```

```javascript
const options = [
	{ label: "Viewer", value: "viewer" },
	{ label: "Editor", value: "editor" },
];
```
