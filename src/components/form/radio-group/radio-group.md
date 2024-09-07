# `radio-group`

`radio-group` provides a convenient way to create a group of `radio` inputs.

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

The options to display as radio buttons can be provided in one of three formats for ease.

- An array of strings `["option1", "option2", "option3"]`, in which case both the label and value are the same.
- An object `{ value: "label" }` where each key is the value of oan option, and each value is the label.
- An array of objects `[{ label: "Label", value: "value" }]` where labels and values are explicitly defined.

It is possible to combine both array options, but generally not recommended.

### `name`

- type: `string`
- default: `null`

A name for this radio group. If not set, the input ID is used.

### `id`

- type: `string`
- default: `null`

Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

### `inline`

- type: `boolean`
- default: `false`

Whether to display options inline (horizontally). This is only recommended when there are two to three options. Any more than that, and vertical display is more clear for the user.

Note that this only takes effect when the radio buttons are in a _container_ that is at least 320px wide.

## Examples

### Basic usage

```html
<radio-group v-model="favouriteIceCream" v-bind="{ options }">
	Favourite ice-cream
</radio-group>
```

```javascript
const options = [
	{ label: "Vanilla", value: "vanilla" },
	{ label: "Chocolate", value: "chocolate" },
	{ label: "Banana", value: "banana" },
	// Strawberry is gross
];
```

### With help

```html
<radio-group v-model="accountType" v-bind="{ inline: true }">
	Account type

	<template #help>
		You can change the account type from the user screen later.
	</template>
</radio-group>
```

```javascript
const options = [
	{ label: "Viewer", value: "viewer" },
	{ label: "Editor", value: "editor" },
];
```
