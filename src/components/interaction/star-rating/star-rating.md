# `star-rating`

`star-rating` offers two optional, mutually inclusive options. Users can either select a rating (out of 5), or view the current aggregate rating. `star-rating` is an extension of `form-radio-group` (and `form-field[type="radio"]`).

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

### `name`

- type: `string`
- default: `null`

A name for this rating group. If not set, the input ID is used.

### `id`

- type: `string`
- default: `null`

Any ID to apply to this field. If an ID is not provided, one will be generated at random. Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

## Examples

### Basic usage

```html
<star-rating v-model="rating">
	Rate your experience
</star-rating>
```

### With help

```html
<star-rating v-model="rating">
	Rate your experience

	<template #help>
		From 1 to 5, with 1 being unacceptable, and 5 being excellent
	</template>
</star-rating>
```
