# `alert-message`

The `alert-message` component is designed to display an accessible message to the user.

## Slots

### `default`

The default slot contains the content of the alert.

## Props

### `type`

- type: `string`
- *required*

The type of alert, one of "success", "error", "warning", "info" or "muted".

## Examples

### Basic success message

```html
<alert-message v-bind="{ type: 'success' }">
	Message
</alert-message>
```
