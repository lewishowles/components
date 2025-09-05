# `modal-controller`

`modal-controller` displays existing modals created using `useModalDialog`. The most recently added modal is displayed, falling back to previous modals (if they exist) once that is closed.

This component teleports its content to the `body`, and should be placed once, centrally, such as in `App.vue`.

## Creating a modal

Creating a modal for display comes in two parts.

### The modal itself

Create a modal dialog as its own component. This can be created as you choose, but using `modal-dialog` is a good starting point. For example:

```html
<template>
	<modal-dialog>
		<template #title>
			Delete "Sophie Wardhaugh"
		</template>

		<p>Are you sure you want to delete this user? This cannot be undone.</p>

		<template #actions>
			<ui-button class="button--primary" v-bind="{ reactive: true }">
				Delete user
			</ui-button>
		</template>
	</modal-dialog>
</template>

<script setup>
	// ...
</script>
```

### Displaying the modal

Displaying the modal involves adding it to the stack via `useModalDialog`. For example:

```javascript
import { useModalDialog } from "@lewishowles/components";

import DeleteUserDialog from "./dialogs/delete-user-dialog";

const { openModal } = useModalDialog();

// ...

const componentProps = { ... };

openModal(DeleteUserDialog, componentProps);
```
