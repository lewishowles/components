# `modal-dialog`

The `modal-dialog` component provides a base modal dialog. When opened, the user's focus is moved to the dialog, and the rest of the page is made inert.

Dialogs should be used sparingly, ideally for confirmation actions.

Using [`modal-controller`](/src/components/messaging/modal-controller/modal-controller.md) with `useModalDialog` is recommended, as opposed to creating individual modals within other components.

## Slots

### `title`

The title of the dialog.

### `default`

The main content of the dialog.

### `actions`

Any specific action buttons the user should be able to interact with.

### `close-dialog-label`

- default: `Close dialog`

The label to use for the close dialog label for screen reader users.

## Props

### `initiallyOpen`

- type: `boolean`
- default: `true`

Whether the dialog should open itself immediately. This is true by default for use with `modal-controller`, but will likely need to be set to false if used directly.

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
