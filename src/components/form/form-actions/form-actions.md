# `form-actions`

`form-actions` is a functional component that adds consistent layout of the actions of a form.

## Slots

### `default`

The default slot contains the content to wrap.

### `label`

An optional visually hidden label for the action group, used by screen readers to identify the group's purpose.

Provide a label when the form has multiple action groups that need to be distinguished (e.g. primary actions and a "danger zone"), or when actions appear far from the form fields.

### `tertiary-actions`

Any additional actions that should appear below the main row.

## Props

`form-actions` provides no props.

## Examples

### Basic usage

```html
<form-actions>
	<ui-button class="button--primary">Save profile</ui-button>
</form-actions>
```

### With a label (standalone)

```html
<form-actions>
	<template #label>Danger zone</template>

	<ui-button>Delete account</ui-button>
</form-actions>
```
