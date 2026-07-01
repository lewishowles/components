# `form-wrapper`

`form-wrapper` is intended as a complete form, wrapped around individual fields. The wrapper automatically adds actions and, when a `rules` prop is provided, handles validation and the generation of an error summary to maximise the accessibility of the form.

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

### `status`

- type: `object`
- default: `null`

Form-wide status feedback shown near the submit button in an accessible live region. Use for overall form state such as success confirmation, permission errors, or session expiry. For specific submission failures, use `submitErrorsCallback`.

Shape: `{ type: 'success' | 'error' | 'info', message: string | string[] }`

`message` can be a single string or an array of strings. `success` and `info` use `aria-live="polite"`; `error` uses `role="alert"` for assertive announcement.

```js
const status = ref(null);

// After a successful save:
status.value = { type: "success", message: "Settings saved." };

// After a permission error:
status.value = { type: "error", message: "You do not have permission to do that." };
```

```html
<form-wrapper v-bind="{ status }">…</form-wrapper>
```

### `updatePageTitleOnError`

- type: `boolean`
- default: `true`

Whether failed validation prefixes `document.title` with `pageTitleErrorPrefix`. Disable this when using router-managed or app-level title handling.

### `pageTitleErrorPrefix`

- type: `string`
- default: `"Error:"`

Localisable prefix added to `document.title` after failed validation. The prefix is removed automatically on a successful submit.

### `readonly`

- type: `boolean`
- default: `false`

When `true`, all child `form-field` components become readonly. Use for review-mode or read-only forms where the user should not edit values. The `readonly` attribute is passed through to each field's underlying control.

```html
<form-wrapper v-bind="{ readonly: true }">…</form-wrapper>
```

### `compact`

- type: `boolean`
- default: `false`

When `true`, reduces vertical spacing in the form. The change cascades automatically to `form-layout` and `form-fieldset`.

```html
<form-wrapper v-bind="{ compact: true }">…</form-wrapper>
```

### `fieldTypes`

- type: `object`
- default: `{}`

Field type transformations applied to submitted form data, keyed by field name. Each value is one of `nullable-number` or `nullable-string`:

- `nullable-number` — `""`/`null`/`undefined` → `null`, else `Number(value)` (`NaN` → `null`)
- `nullable-string` — `""` → `null`, else kept as-is

See [`useFormData`](/src/composables/use-form-data/use-form-data.js) for the equivalent init-side coercion.

```html
<form-wrapper v-bind="{ fieldTypes: { age: 'nullable-number' } }">…</form-wrapper>
```

### `layoutClasses`

- type: `string`
- default: `""`

Additional classes passed to the inner `form-layout`.

```html
<form-wrapper layout-classes="gap-y-4">…</form-wrapper>
```

### `rules`

- type: `object`
- default: `{}`

All validation lives here, keyed by field name. Each value is an array of rules run against the full form data on submit. Keeping validation in one place keeps it contained rather than spread across fields, and it also allows rules that rely on other fields.

```js
const rules = {
	confirmPassword: [{ rule: "same", field: "password", message: "Passwords must match" }],
	endDate: [
		{
			rule: "custom",
			validate: (value, formData) => !value || !formData.startDate || value > formData.startDate,
			message: "End date must be after the start date",
		},
	],
};
```

```html
<form-wrapper v-bind="{ rules }"></form-wrapper>
```

Each entry in a field's rules array can be either an object `{ rule, message?, ...ruleOptions }` or a function `(value, formData)` (see Function shorthand below).

#### `required`

`[{ rule: "required", message: "Enter your name so we know what to call you" }]`

Requires a value to be set. Adds the `required` attribute to the field automatically.

#### `email`

`[{ rule: "email", message: "We need an email address to set up your account" }]`

Perform a minimal check to see if the value contains an `@` symbol. More complex verification isn't really necessary, and the only true way to test an email address is through verification.

#### `size`

`[{ rule: "size", size: 11, message: "Your phone number should be 11 digits long" }]`

Ensure that the provided value is has at least size `size`. For strings, the number of characters is used, for arrays, the length of the array, for objects, the number of properties, for numbers, the number itself is used, and for numeric strings the integer value of the string is used.

#### `min`

`[{ rule: "min", min: 11, message: "Your phone number should be at least 11 digits long" }]`

Ensure that the provided value is has at least size `min`. Values are evaluated as in the `size` rule.

#### `max`

`[{ rule: "max", max: 11, message: "Your phone number should be no more than 11 digits long" }]`

Ensure that the provided value is has at most size `max`. Values are evaluated as in the `size` rule.

#### `between`

`[{ rule: "between", min: 5, max: 8, message: "Your post code should be between 5 and 8 characters" }]`

Ensure that the provided value is has between `min` and `max` size. Values are evaluated as in the `size` rule.

#### `in`

`[{ rule: "in", options: ["a", "b", "c"], message: "Your choice should be a, b, or c" }]`

Ensure that the given value is included within `options`.

#### `not_in`

`[{ rule: "not_in", options: ["a", "b", "c"], message: "Your choice should not include a, b, or c" }]`

Ensure that the given value is not included within `options`.

#### `regexp`

`[{ rule: "regexp", regexp: /[abc]+/, message: "Your ID should only contain the letters a, b, and c" }]`

Ensure that the provided value matches `regexp`.

#### `same` / `different`

`[{ rule: "same", field: "password", message: "Passwords must match" }]`

Compare the value against another field's value. `same` requires them to match; `different` requires them to differ.

#### `custom`

`[{ rule: "custom", validate: (value, formData) => value > formData.startDate, message: "End date must be after the start date" }]`

The escape hatch for any constraint the declarative rules can't express, including cross-field validation. `validate` receives the field's own value and the complete form data.

#### Function shorthand

`[(value) => isNonEmptyString(value) || "Enter your name"]`

A rule entry can also be a function `(value, formData)` instead of an object. The return value determines the outcome:

- `true` or any truthy non-string — valid.
- A non-empty string — invalid; the string is used as the error message.
- A non-empty array of strings — invalid; each string becomes an error message.

#### Error order

A form-level error is mapped to its named field, so it displays beside that field and appears in the error summary. Within a field, errors follow the order of its rules array. Rules re-run on every submit, so resolved errors clear.

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

Four values are provided by `form-wrapper` under the "form-wrapper" namespace.

### `fieldErrorsFor(fieldName)`

Returns all error messages for a field, deduplicating identical messages. Combines parent-owned `fieldErrors`, submit callback errors, and form-level `rules` errors into a single array. Used by `form-field` for its error display.

| Parameter   | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `fieldName` | `string` | The name of the registered field. |

### `registerField(field)`

Allow a field to register itself with the form.

| Parameter            | Type       | Description                                                |
| -------------------- | ---------- | ---------------------------------------------------------- |
| `field.name`         | `string`   | Name of the field to register.                             |
| `field.id`           | `string`   | The ID of the field, helpful for linking errors to fields. |
| `field.triggerFocus` | `function` | Method to focus on this field, used by the error summary.  |

### `updateFieldValue(name, value)`

Allow a field to update its value in the form.

| Parameter | Type      | Description                      |
| --------- | --------- | -------------------------------- |
| `name`    | `string`  | The name of the field to update. |
| `value`   | `unknown` | The value to set.                |

### `isReadonly`

A reactive boolean that reflects the `readonly` prop. Used by `form-field` to cascade readonly state to underlying controls. Not intended for direct consumer use.

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
