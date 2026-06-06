# `modal-controller`

`modal-controller` displays existing modals created using `useModalDialog`. The most recently added modal is displayed, falling back to previous modals (if they exist) once that is closed.

This component teleports its content to the `body`, and should be placed once, centrally, such as in `App.vue`.

## Creating a modal

Creating a modal for display comes in two parts.

### The modal itself

Create the _content_ of the dialog as a component. Note that you should not wrap the content in a dialog itself. This is handled by `modal-controller`.

```html
<template>
	<modal-dialog-title>Delete "Sophie Wardhaugh"</modal-dialog-title>

	<p>Are you sure you want to delete this user? This cannot be undone.</p>

	<modal-dialog-actions>
		<ui-button class="button--primary" v-bind="{ reactive: true }">Delete user</ui-button>
	</modal-dialog-actions>
</template>

<script setup>
	// ...
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
