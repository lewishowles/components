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
- _required_

The type of alert, one of "success", "error", "warning", "info" or "muted". Note that a "muted" alert does not have an icon by default.

### `showIcon`

- type: `boolean`
- default: `true`

Whether to show an icon with the alert. Note that a "muted" alert does not have an icon by default.

## Styling hooks

| Attribute                        | Element         | Notes                                                                   |
| -------------------------------- | --------------- | ----------------------------------------------------------------------- |
| `data-component="alert-message"` | Root            | Scope styles to this component                                          |
| `data-part="icon"`               | Icon wrapper    | Present when an icon is shown                                           |
| `data-part="title"`              | Title element   | Present when `title` slot is populated                                  |
| `data-part="content"`            | Content wrapper | —                                                                       |
| `data-state`                     | Root            | Alert type: `"success"`, `"error"`, `"warning"`, `"info"`, or `"muted"` |

## Examples

### Basic success message

```html
<alert-message v-bind="{ type: 'success' }">Message</alert-message>
```

### With title

```html
<alert-message v-bind="{ type: 'success' }">
	<template #title>Message title</template>

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
