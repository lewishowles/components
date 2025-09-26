# `base-modal`

The `base-modal` component provides the base functionality required to display a modal, and is intended to allow any component to be displayed within a modal easily, which is why it is used by [`modal-controller`](/src/components/messaging/modal-controller/modal-controller.md).

For quick way to create consistent dialogs, including a title and actions, use [`modal-dialog`](/src/components/messaging/modal-dialog/modal-dialog.md).

## Slots

### `default`

The main content of the dialog.

### `close-dialog-label`

- default: `Close dialog`

The label to use for the close dialog label for screen reader users.

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
<base-modal ref="login-screen-dialog">
	<login-screen />
</base-modal>
```
