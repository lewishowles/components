# `form-layout`

`form-layout` is a functional component that adds consistent spacing between elements in a form. Both `form-wrapper` and `form-fieldset` automatically include a `form-layout` element.

## Slots

### `default`

The default slot contains the content to wrap.

## Props

`form-layout` provides no props.

## Examples

### Basic usage

```html
<form-layout>
	<form-input v-model="name">
		Your name
	</form-input>

	<form-textarea v-model="biography">
		A little about yourself
	</form-textarea>
</form-layout>
```
