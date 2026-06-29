# `modal-dialog-title`

Display a title within a modal dialog in a standardised format.

## Slots

### `default`

The content of the dialog title.

### `subtitle`

Optional explanatory text displayed below the title.

## Props

### `tag`

- type: `string`
- default: `h2`

The tag to use for the dialog title.

## Styling hooks

### `data-part="subtitle"`

Present on the subtitle wrapper when the `subtitle` slot is populated.

## Examples

```html
<modal-dialog-title>
	Delete user {{ username }}
	<template #subtitle>This action cannot be undone.</template>
</modal-dialog-title>
```
