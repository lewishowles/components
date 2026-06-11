# `form-wrapper`

`form-wrapper` is intended as a complete form, wrapped around individual fields. The wrapper automatically adds actions and, when fields are provided validation information, handles field validation and the generation of an error summary to maximise the accessibility of the form.

We recommend a [required by default, marked if optional technique](https://adamsilver.io/blog/how-to-highlight-required-and-optional-form-fields/) for form fields, meaning that optional fields should be marked as such.

`form-wrapper` automatically includes `form-layout` around its `default` content.

## Props

### `fieldErrors`

- type: `object`
- default: `{}`

Field-level errors managed by the parent, usually from an API response. Keys should match registered `form-field` names. Values can be either a single message or a list of messages.

These errors are shown in the error summary and passed to the relevant field so they use the same error display as validation messages. They are controlled by the parent and are not cleared automatically when field values change.

```js
const fieldErrors = {
	date: "The date must be in the future",
	email: ["The email address provided already exists"],
};
```

### `submitErrorsCallback`

- type: `function`
- default: `null`

An optional callback that maps a rejected submit Promise into an errors object. The callback only runs when the submit handler returns a rejecting Promise. If the handler catches the error itself, the callback will not run.

Keys matching registered `form-field` names are shown in the error summary and passed to the field, exactly like `fieldErrors`. Keys that don't match a registered field are treated as general submit errors and rendered near the submit button using the `submit-errors` slot. Return an empty value for errors the form should not handle.

```js
function parseApiSubmitErrors(error) {
	if (!error.response?.data?.errors) {
		return null;
	}

	return error.response.data.errors;
}
```

### `layoutClasses`

- type: `string`
- default: `""`

Additional classes passed to the inner `form-layout`.

```html
<form-wrapper layout-classes="gap-y-4">…</form-wrapper>
```

## Slots

### `pre-form`

Any elements to place before the form elements, and outside of the `form-layout` wrapper. For example, navigational items such as "Back to …" or "Forgot password".

### `default`

The `default` slot contains the content of the form itself, including any fields, layout elements, or information as necessary.

| Slot prop      | Type      | Description                                         |
| -------------- | --------- | --------------------------------------------------- |
| `isSubmitting` | `boolean` | Whether a form submission is currently in progress. |
| `hasErrors`    | `boolean` | Whether the form currently has validation errors.   |

### `submit-button-label`

The label to use on the submit button. This should be representative of what is about to happen—such as "Create account" or "Update settings", not something generic, and as such **no default label is provided**.

### `secondary-actions`

Additional actions to appear beside the submit button—such as "Save and exit" to come back to the form later. Any actions that relate to a particular field—such as "Add another"—should appear with that field or group of fields, not in the actions of the form.

### `tertiary-actions`

Additional actions to appear below the primary and secondary actions, such as "Cancel". Navigational actions, such as "Back to …" or "Forgot password" should appear above the form fields, such as in the `pre-form` slot.

### `submit-errors`

Overrides the default general error display near the form's actions. If not provided, a single error is rendered as a `<p>` and multiple errors as a `<ul>`.

| Slot prop | Type       | Description                                                                       |
| --------- | ---------- | --------------------------------------------------------------------------------- |
| `errors`  | `string[]` | General errors produced by `submitErrorsCallback` whose keys don't match a field. |

### `messages`

A placement slot for general form feedback, such as success messages, flash messages, or anything that belongs near the submit button but isn't tied to a specific error state.

```html
<template #messages>
	<flash-messages :namespace="FORM_MESSAGES" />
</template>
```

### `error-summary-title`

- default: "There is a problem"

The title of the error summary that appears if any errors are found in the form.

### `actions-label`

An optional visually hidden label for the form's action group, threaded into `form-actions` via `aria-labelledby`. Omit it for most forms — a single action group doesn't need a label. Provide one when the form has multiple action groups that need to be distinguished (e.g. primary actions alongside a "danger zone"), or in complex layouts where the group's purpose may not be obvious from context.

## Events

### `submit`

Fired when the user submits the form and validation succeeds, containing the current values of each of the `form-field` elements contained within the form.

### `v-model`

The current values of each of the `form-field` elements contained within the form will be available as an object through `v-model`.

## Methods

### `resetSubmitButton`

Resets the submit button's loading state. Call this after your `@submit` handler completes if it does not return a Promise — for example, when the async work is deferred or the result comes back via a separate channel.

## Provide

Two methods are provided by `form-wrapper` under the "form-wrapper" namespace to allow a field to communicate and update its value.

### `registerField(field)`

Allow a field to register itself with the form.

| Parameter             | Type       | Description                                                |
| --------------------- | ---------- | ---------------------------------------------------------- |
| `field.name`          | `string`   | Name of the field to register.                             |
| `field.id`            | `string`   | The ID of the field, helpful for linking errors to fields. |
| `field.validateField` | `function` | Validation function, run when the form is submitted.       |
| `field.triggerFocus`  | `function` | Method to focus on this field, used by the error summary.  |

### `updateFieldValue(name, value)`

Allow a field to update its value in the form.

| Parameter | Type      | Description                      |
| --------- | --------- | -------------------------------- |
| `name`    | `string`  | The name of the field to update. |
| `value`   | `unknown` | The value to set.                |

## Styling hooks

| Attribute                       | Element | Notes                          |
| ------------------------------- | ------- | ------------------------------ |
| `data-component="form-wrapper"` | Root    | Scope styles to this component |

## Examples

### Basic form

```html
<form-wrapper v-model="formData">
	<form-field name="your_name">Your name</form-field>
</form-wrapper>
```

## To do

- Handle form submit
- When attempting to submit a form, ensure that any provided validation is checked
