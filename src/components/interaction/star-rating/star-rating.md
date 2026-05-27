# `star-rating`

`star-rating` offers two optional, mutually inclusive options. Users can either select a rating (out of 5), or view the current aggregate rating. `star-rating` is an extension of `form-field[type="radio"]` (and thus `form-radio-group`).

## Slots

### `default`

The label of the field. A label is always required — this component will show an error if none is provided.

### `option-label`

The label for each selectable option. Receives `{ value }` as a slot prop. Defaults to unit-aware English ("1 star", "2 stars", "1 heart", etc.).

| Slot prop | Type     | Description               |
| --------- | -------- | ------------------------- |
| `value`   | `number` | The current rating value. |

### `read-only-label`

The label for the `readOnly` display. Defaults to "Star rating" when no value is set, or "Rating: N of 5 stars" when one is.

| Slot prop | Type     | Description               |
| --------- | -------- | ------------------------- |
| `value`   | `number` | The current rating value. |

### `current-rating`

Additional text displaying the current aggregate rating, for example "4.5/5 based on 300 reviews".

### `introduction`

Additional text introducing the options, appearing between the label and options.

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

## Styling hooks

| Attribute                      | Element             | Notes                                         |
| ------------------------------ | ------------------- | --------------------------------------------- |
| `data-component="star-rating"` | Root element        | Scope styles to this component                |
| `data-part="options"`          | Options wrapper     | Contains all star/heart options               |
| `data-part="option"`           | Each option wrapper | Only present when interactive (not read-only) |
| `data-readonly`                | Root                | Present when in read-only mode                |

## Examples

### Basic usage

```html
<star-rating v-model="rating"> Rate your experience </star-rating>
```

### With help

```html
<star-rating v-model="rating">
	Rate your experience

	<template #help> From 1 to 5, with 1 being unacceptable, and 5 being excellent </template>
</star-rating>
```
