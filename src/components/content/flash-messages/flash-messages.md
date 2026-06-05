# `flash-messages`

Display one or more flash messages to the user, optionally filtered to the provided `namespace`. If no `namespace` is provided, messages that are generated without a `namespace` will be shown.

It may often be useful to include one instance without a namespace at the top of a page for general messages, and other namespaced instances nearer the components that would trigger those messages.

## Props

### `namespace`

- type: `string`
- default: `null`

The namespace from which to retrieve messages. If no namespace is provided, only messages without a namespace will be displayed.

## Slots

### `default`

Custom content for each message. The slot receives the stored `message` object, including its generated `id`.

If no default slot is provided, each message is shown with `alert-message`.

### `icon`

Any icon to display in the default `alert-message` output, overriding the alert's default icon.

## Styling hooks

| Attribute                         | Element | Notes                          |
| --------------------------------- | ------- | ------------------------------ |
| `data-component="flash-messages"` | Root    | Scope styles to this component |

## Examples

### Basic usage

```html
<flash-messages namespace="users" />
```

```js
const { sendMessage } = useFlashMessages();

sendMessage({
	namespace: "users",
	type: "success",
	title: "User approved",
	message: "The user has been approved.",
});
```

### Custom message content

```html
<flash-messages namespace="users">
	<template #default="{ message }">
		<p>{{ message.title }}: {{ message.message }}</p>
	</template>
</flash-messages>
```
