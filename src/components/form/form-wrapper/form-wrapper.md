# `form-wrapper`

`form-wrapper` is intended as a complete form, wrapped around individual fields. The wrapper automatically adds actions and, when fields are provided validation information, handles field validation and the generation of an error summary to maximise the accessibility of the form.

## Slots

### `default`

The `default` slot contains the content of the form itself, including any fields, layout elements, or information as necessary.

## Events

### `v-model`

The current values of each of the `form-field` elements contained within the form will be available as an object through `v-model`.

## Provide

Two methods are provided by `form-wrapper` under the "form-wrapper" namespace to allow a field to communicate and update its value.

### `registerField(name)`

Register a field with the form, providing its name. This will initialise its value to `null`.

### `updateFieldValue(name, value)`

Update the value of field with `name` to `value`.

## Examples

### Basic form

```html
<form-wrapper v-model="formData">
	<form-field name="username" />
</form-wrapper>
```

## To do

- When attempting to submit a form, ensure that any provided validation is checked
