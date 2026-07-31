# `form-file`

`form-file` is a file upload field. By default, it accepts one file; set
`multiple` to `true` to allow the user to select more than one file.

There's no `accept` prop. Restricting file types via `accept` can hide non-matching files in some OS file pickers, confusing users who can't find the file they want to upload. Instead, validate type, size, and other constraints as `rules` on the parent `form-wrapper`.

## Slots

### `default`

The default slot contains the label of the field.

_A label is required for screen reader users. The component shows an error when no label is provided._

### `optional-indicator`

Content shown after the label text when the field is not required. Defaults to `(optional)`.

### `introduction`

Any additional text to introduce this input, which appears between the label and the input.

### `error`

Any error text to display below the field.

### `help`

Any help text to display below the field.

### `remove-button-label`

Content for the button that clears the current selection. Receives `files`, an array containing the current `File` objects. The default is `Remove filename` for one file, or `Remove N files` for multiple selections.

## Props

### `id`

- type: `string`
- default: `null`

The input ID. A unique ID is generated when omitted.

### `multiple`

- type: `boolean`
- default: `false`

Whether to allow selecting more than one file. When `false`, `v-model` contains a `File` or `null`. When `true`, it contains an array of `File` objects or `null`. The remove button clears the complete current selection.

### `inputAttributes`

- type: `object`
- default: `null`

Any additional attributes to pass to the input itself, such as `accept` or `aria-labelledby`. The component manages `id`, `type`, `multiple`, `required`, and generated ARIA attributes. Custom `aria-describedby` values are added to the component's own description IDs.

### `required`

- type: `boolean`
- default: `false`

Whether this field is required.

### `showOptionalIndicator`

- type: `boolean`
- default: `true`

Whether to show optional text when the field is not required.

## Events

### `v-model`

The current selection, or `null` when no file is selected, is available via `v-model`.

When `multiple` is `true`, the model contains an array of selected files instead. An empty selection is represented by `null`.

Browsers do not allow a native file input to be populated programmatically. An initial `File` or array of `File` objects can exist in the model, but it does not populate the browser's file input. The user must select the files again before the native input contains them. Previewing existing files is not part of this API.

## Methods

### `triggerFocus`

Focus this input.

## Styling hooks

| Attribute                    | Element         | Notes                                 |
| ---------------------------- | --------------- | ------------------------------------- |
| `data-component="form-file"` | Root            | Scope styles to this component        |
| `data-invalid`               | Root            | Present when the field has an error   |
| `data-part="controls"`       | Input container | Wraps the `<input>` and remove button |
| `data-part="remove"`         | Remove button   | Present once a file is selected       |

## Examples

### Basic usage

```html
<form-file v-model="supportingDocument">Supporting document</form-file>
```

### Multiple files

```html
<form-file v-model="supportingDocuments" multiple>Supporting documents</form-file>
```

### With help text

```html
<form-file v-model="supportingDocument">
	Supporting document

	<template #help>PDF files only, up to 5MB.</template>
</form-file>
```
