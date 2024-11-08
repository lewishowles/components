# `form-wrapper`

`form-wrapper` is intended as a complete form, wrapped around individual fields. The wrapper automatically adds actions and, when fields are provided validation information, handles field validation and the generation of an error summary to maximise the accessibility of the form.

We use a [required by default, marked if optional technique](https://adamsilver.io/blog/how-to-highlight-required-and-optional-form-fields/) for form fields, meaning that option fields are marked as such.

## Slots

### `pre-form`

Any elements to place before the form elements, and outside of the `form-layout` wrapper. For example, navigational items such as "Back to …" or "Forgot password".

### `default`

The `default` slot contains the content of the form itself, including any fields, layout elements, or information as necessary.

### `submit-button-label`

The label to use on the submit button. This should be representative of what is about to happen—such as "Create account" or "Update settings", not something generic, and as such **no default label is provided**.

### `secondary-actions`

Additional actions to appear beside the submit button—such as "Save and exit" to come back to the form later. Any actions that relate to a particular field—such as "Add another"—should appear with that field or group of fields, not in the actions of the form.

### `tertiary-actions`

Additional actions to appear below the primary and secondary actions, such as "Cancel". Navigational actions, such as "Back to …" or "Forgot password" should appear above the form fields, such as in the `pre-form` slot.

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

- Handle form submit
- When attempting to submit a form, ensure that any provided validation is checked
