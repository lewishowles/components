# `modal-controller`

`modal-controller` displays existing modals created using `useModalDialog`. The most recently added modal is displayed, falling back to previous modals (if they exist) once that is closed.

This component teleports its content to the `body`, and should be placed once, centrally, such as in `App.vue`.

## Creating a modal

Creating a modal for display comes in two parts.

### The modal itself

Each component opened via `openModal` must be fully self-contained: it renders its own [`modal-dialog`](/src/components/messaging/modal-dialog/modal-dialog.md), forwards the `inert` prop it receives into it, and calls the `onClose` prop it receives when its dialog closes. This avoids nesting a second dialog inside the one `modal-controller` would otherwise provide.

```html
<template>
	<modal-dialog v-bind="{ inert }" @dialog:close="onClose?.()">
		<template #title>Delete "Sophie Wardhaugh"</template>

		<p>Are you sure you want to delete this user? This cannot be undone.</p>

		<template #actions>
			<ui-button class="button--primary" v-bind="{ reactive: true }">Delete user</ui-button>
		</template>
	</modal-dialog>
</template>

<script setup>
	const props = defineProps({
		/**
		 * Whether this modal is inert, provided by modal-controller when a modal
		 * further up the stack is currently active.
		 */
		inert: {
			type: Boolean,
			default: false,
		},

		/**
		 * Called when this modal should close, provided by modal-controller.
		 */
		onClose: {
			type: Function,
			default: null,
		},
	});
</script>
```

### Displaying the modal

Displaying the modal involves adding it to the stack via `useModalDialog`. For example:

```javascript
import { useModalDialog } from "@lewishowles/components";

import DeleteUser from "./fragments/delete-user";

const { openModal } = useModalDialog();

// ...

const componentProps = { ... };

openModal(DeleteUser, componentProps);
```

### Reacting to the modal closing

Pass your own `onClose` in the props given to `openModal` to run something whenever the modal closes, for any reason (a specific action like confirm, the built-in close button, or Escape). `modal-controller` runs it before popping the modal off the stack, so you don't need to reimplement stack-popping yourself, and it composes with any other callback the component defines for a more specific outcome:

```javascript
openModal(RevokeAccessConfirm, {
	onConfirm: () => revokeAccess(vehicleId),
	onClose: () => trackDialogDismissed("revoke-access"),
});
```
