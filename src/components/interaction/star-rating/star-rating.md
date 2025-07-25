# `star-rating`

`star-rating` offers two optional, mutually inclusive options. Users can either select a rating (out of 5), or view the current aggregate rating. `star-rating` is an extension of `form-field[type="radio"]` (and thus `form-radio-group`).

## Slots

### `default`

The default slot contains the label of the field.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `current-rating`

A space to place additional text to display the current average rating, for example "4.5/5 based on 300 reviews".

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

### `readOnly`

- type: `boolean`
- default: `false`

Whether to allow the user to choose a rating. If false, this component can just be used to display a current rating, or activated based on some other change, such as an edit.

### `shape`

- type: `string`
- default: `star`

One of `star` or `heart`. Defaults to `star` if the shape is unrecognised.

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
