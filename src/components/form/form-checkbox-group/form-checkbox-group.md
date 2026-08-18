# `form-checkbox-group`

`form-checkbox-group` provides a convenient way to create a group of `radio` inputs.

Supports `v-model` to bind the currently selected item's value.

## Slots

### `default`

The default slot contains the label of the field.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `optional-indicator`

Content shown after the label text when the field is not required. Defaults to `(optional)`.

### `introduction`

Any additional text to introduce the options, which appears between the label and options.

### `option`

Custom content for one option. The existing input and label stay in place, while the slot receives `option`, `selected`, `id`, and `name`.

### `error`

Any error text to display below the field.

### `help`

Any help text to display below the field.

## Props

### `options`

- type: `array|object`
- **required**

The options to be displayed as checkboxes can be provided in a number of formats for ease.

- An array of strings `["option1", "option2", "option3"]`, in which case both the label and value are the same.
- An array of numbers `[1, 2, 3]`, in which case both the label and value are the same.
- An array of objects `[{ label: "Label", value: "value" }]` where labels and values are explicitly defined.
- An array of objects with an optional `description`, shown beneath the label.
- An array of objects combined with the `labelKey` and `valueKey` properties.
- An object `{ value: "label" }` where each key is the value of an option, and each value is the label.

### `labelKey`

- type: `string`
- default: `label`

The key needed to find each option's label within its object. If an individual option is a string or number, this is ignored.

### `valueKey`

- type: `string`
- default: `value`

The key needed to find each option's value within its object. If an individual option is a string or number, this is ignored.

### `descriptionKey`

- type: `string`
- default: `description`

The key needed to find an optional description associated with each option.

### `name`

- type: `string`
- default: `null`

A name for this checkbox group. If not set, the input ID is used.

### `id`

- type: `string`
- default: `null`

Any ID to apply to this checkbox group. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

### `variant`

- type: `string`
- default: `null`
- values: `card`

Use `card` to give each option a bordered card treatment, with selected options using primary-colour border and background tokens.

### `optionClasses`

- type: `string|array|object`
- default: `null`

Additional classes to merge onto every option row. Use this with the `option` slot when the card preset does not match the required design. Conditional styling for selected, first, or last options can target the option row's `data-state` and `data-position` attributes in your own CSS.

## Methods

### `triggerFocus`

Focus this checkbox group.

## Styling hooks

| Attribute                              | Element | Notes                          |
| -------------------------------------- | ------- | ------------------------------ |
| `data-component="form-checkbox-group"` | Root    | Scope styles to this component |

## Examples

### Basic usage

```html
<form-checkbox-group v-model="favouriteIceCream" v-bind="{ options }">
	Favourite ice-cream
</form-checkbox-group>
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
<form-checkbox-group v-model="accountType" v-bind="{ inline: true }">
	Account type

	<template #help>You can change the account type from the user screen later.</template>
</form-checkbox-group>
```

```javascript
const options = [
	{ label: "Viewer", value: "viewer" },
	{ label: "Editor", value: "editor" },
];
```
