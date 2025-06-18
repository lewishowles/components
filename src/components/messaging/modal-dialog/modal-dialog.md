# `modal-dialog`

The `modal-dialog` component provides a base modal dialog. When opened, the user's focus is moved to the dialog, and the rest of the page is made inert.

Dialogs should be used sparingly, ideally for confirmation actions.

## Slots

### `title`

The title of the dialog.

### `default`

The main content of the dialog.

### `actions`

Any specific action buttons the user should be able to interact with.

## Props

### `initiallyOpen`

- type: `boolean`
- default: `false`

Whether the dialog should open itself immediately.

### `focusDialogOnOpen`

- type: `boolean`
- default: `true`

When opening the dialog, determine whether to focus the dialog itself, or the first focusable element within it.

## Events

### `@dialog:close`

Fired when the dialog is closed by the user.

## Methods

### `open`

Open the dialog.

### `close`

Close the dialog.

## Examples

### Basic dialog

```html
<modal-dialog>
	<template #title>
		Delete your account
	</template>

	Are you sure you want to delete your account? This cannot be undone.

	<template #actions>
		<ui-button class="button--danger" @click="deleteAccount">
			Delete my account
		</ui-button>

		<ui-button class="button--muted" @click="closeDialog">
			Cancel
		</ui-button>
	</template>
</modal-dialog>
```
