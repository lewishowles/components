# `alert-message`

The `alert-message` component is designed to display an accessible message to the user.

## Slots

### `title`

Any title to display with the message.

### `default`

The default slot contains the content of the alert.

### `icon`

Any icon to display in the alert, overriding any default icon.

## Props

### `type`

- type: `string`
- *required*

The type of alert, one of "success", "error", "warning", "info" or "muted".

### `showIcon`

- type: `boolean`
- default: `true`

Whether to show an icon with the alert.

## Examples

### Basic success message

```html
<alert-message v-bind="{ type: 'success' }">
	Message
</alert-message>
```

### With title

```html
<alert-message v-bind="{ type: 'success' }">
	<template #title>
		Message title
	</template>

	Message
</alert-message>
```

### With custom icon

```html
<alert-message v-bind="{ type: 'success' }">
	<template #icon>
		<icon-arrow-up />
	</template>

	Message
</alert-message>
```
