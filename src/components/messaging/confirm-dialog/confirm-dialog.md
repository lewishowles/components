# `confirm-dialog`

`confirm-dialog` is a [`modal-dialog`](/src/components/messaging/modal-dialog/modal-dialog.md) built for confirm/cancel decisions, such as destructive actions. It renders with the `alert` variant, so it interrupts the user and requires a response.

Use it directly via `openModal`, following the [`modal-controller`](/src/components/messaging/modal-controller/modal-controller.md) contract. `inert` doesn't need declaring or forwarding yourself: `confirm-dialog` doesn't declare it either, so Vue passes it straight through to the underlying `modal-dialog`, which does.

## Slots

### `title`

The title of the dialog.

### `default`

The body content: the question or explanation the user needs to decide on.

### `confirm-button-label`

- default: `Confirm`

Content for the confirm button.

### `cancel-button-label`

- default: `Cancel`

Content for the cancel button.

## Props

### `danger`

- type: `boolean`
- default: `false`

Whether the confirm action is destructive, styling the confirm button to match.

### `onConfirm`

- type: `function`
- default: `null`

Called when the confirm action is chosen. Dialogs close immediately, so user-feedback should be provided by the parent, outside of the dialog itself.

### `onClose`

- type: `function`
- default: `null`

Called when this dialog closes, for any reason.

## Examples

### Confirming a destructive action

```html
<!-- delete-account-confirm.vue -->
<template>
	<confirm-dialog danger v-bind="{ onConfirm, onClose }">
		<template #title>Delete your account</template>

		<p>Are you sure you want to delete your account? This cannot be undone.</p>

		<template #confirm-button-label>Delete my account</template>
	</confirm-dialog>
</template>

<script setup>
	defineProps({
		/**
		 * Called when the confirm action is chosen.
		 */
		onConfirm: {
			type: Function,
			default: null,
		},

		/**
		 * Called when this dialog closes, for any reason.
		 */
		onClose: {
			type: Function,
			default: null,
		},
	});
</script>
```

`inert` isn't declared here either — since this component's own root is `confirm-dialog`, it falls through the same way, two levels deep.

```javascript
import { useModalDialog } from "@lewishowles/components";

import DeleteAccountConfirm from "./delete-account-confirm.vue";

const { openModal } = useModalDialog();

function confirmDeleteAccount() {
	openModal(DeleteAccountConfirm, {
		onConfirm: () => deleteAccount(),
	});
}
```
