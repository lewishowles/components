# `form-flow`

`form-flow` joins a number of `form-screen` components into one multi-page form, showing one screen's content at a time.

Moving forward with continue validates the current screen, while moving back does not.

## Slots

### `default`

One or more `form-screen` components plus other content. Content outside of `form-screen` is always shown on each page.

| Slot prop      | Type      | Description                                         |
| -------------- | --------- | --------------------------------------------------- |
| `isSubmitting` | `boolean` | Whether a form submission is currently in progress. |
| `hasErrors`    | `boolean` | Whether the form currently has validation errors.   |

### `empty`

- default: "No screens are available."

The message to show when all screens are removed and no screen is available. The flow does not render navigation or submit actions in this state, so it cannot submit.

### `back-label`

- default: "Back"

The label for the Back button.

### `continue-label`

- default: "Continue"

The label for the continue button on interim screens.

### `submit-button-label`

The label to use on the submit button. This should be representative of what is about to happen, such as "Create account" or "Update settings", not something generic, and as such **no default label is provided**.

### `submit-errors`

Overrides the default general error display near the form's actions. If not provided, a single error is rendered as a `<p>` and multiple errors as a `<ul>`.

| Slot prop | Type       | Description                                                                       |
| --------- | ---------- | --------------------------------------------------------------------------------- |
| `errors`  | `string[]` | General errors produced by `submitErrorsCallback` whose keys don't match a field. |

### `error-summary-title`

- default: "There is a problem"

The title of the error summary that appears if any errors are found in the form.

## Props

### `fieldErrors`

- type: `object`
- default: `{}`

Field-level errors managed by the parent, usually from an API response. Keys should match registered `form-field` names. Values can be either a single message or a list of messages.

These errors are shown in the error summary and passed to the relevant field so they use the same error display as validation messages. They are controlled by the parent and are not cleared automatically when field values change.

### `submitErrorsCallback`

- type: `function`
- default: `null`

An optional callback that maps a rejected submit Promise into an errors object. The callback only runs when the submit handler returns a rejecting Promise. If the handler catches the error itself, the callback will not run.

Keys matching registered `form-field` names are shown in the error summary and passed to the field, exactly like `fieldErrors`. Keys that don't match a registered field are treated as general submit errors and rendered near the submit button using the `submit-errors` slot. Return an empty value for errors the form should not handle.

### `status`

- type: `object`
- default: `null`

Form-wide status feedback shown near the submit button in an accessible live region. Defaults to `useForm`'s own submit-lifecycle status, so failed submits show an inline error automatically with no setup. Pass a value to override with app-driven state such as a permission error or session expiry, which takes precedence until cleared. For specific submission failures, use `submitErrorsCallback`.

Shape: `{ type: 'success' | 'error' | 'info', message?: string | string[] }`

`message` is optional. A bare successful submit has no message and shows no visible alert here by design: success feedback usually belongs in the app's own flash/toast system, wired up via `onSuccess` (see below), rather than a second inline banner.

`message` can be a single string or an array of strings. `success` and `info` use `aria-live="polite"`; `error` uses `role="alert"` for assertive announcement.

### `onSuccess`, `onError`, `onSettled`

- type: `function`
- default: `null`

Submit lifecycle hooks, called with submit-ready data from `useForm`. By submit-ready, we mean that the returned data
only contains currently registered fields. When a field is unregistered, its value remains in
`v-model`, but is excluded from submit unless a field with the same name is registered again.

Use these hooks for app-level side effects, such as a flash message, closing a modal, or navigating away, that live
outside the inline `status` alert.

- `onSuccess(result, formData)`: called once `onSubmit` resolves.
- `onError(error, formData)`: called when `onSubmit` rejects, before `submitErrorsCallback` decides whether to swallow the error.
- `onSettled(result, error, formData)`: always called after a submit attempt, whichever of `result`/`error` didn't occur is `undefined`.
-

### `updatePageTitleOnError`

- type: `boolean`
- default: `true`

Whether to update the page title when validation fails. When enabled, `pageTitleErrorPrefix` is added to the start of `document.title`.

### `pageTitleErrorPrefix`

- type: `string`
- default: `"Error:"`

A prefix added to `document.title` after failed validation. The prefix is removed automatically on a successful submit.

### `readonly`

- type: `boolean`
- default: `false`

When `true`, all child `form-field` components become readonly. Use for review-mode or read-only forms where the user should not edit values. The `readonly` attribute is passed through to each field's underlying control.

### `unsavedChangesGuard`

- type: `boolean`
- default: `true`

Whether this form guards against losing unsaved changes: warns on tab close/refresh while dirty, and contributes to the shared dirty-form count that `installUnsavedChangesGuard`'s router guard checks (see the `useForm` docs). Set to `false` for trivial forms, such as a live search filter, where the guard would be unwanted noise.

### `compact`

- type: `boolean`
- default: `false`

When `true`, reduces vertical spacing in the form. The change cascades automatically to `form-layout` and `form-fieldset`.

### `fieldTypes`

- type: `object`
- default: `{}`

Field type transformations applied to initial and submitted form data, keyed by field name. Each value is one of `nullable-number` or `nullable-string`:

- `nullable-number`: `""`/`null`/`undefined` → `null`, else `Number(value)` (`NaN` → `null`)
- `nullable-string`: `""` → `null`, else kept as-is

### `initialData`

- type: `object | function`
- default: `null`

An object, ref, computed, or getter used to seed the form once it resolves truthy. When this prop is omitted, the form continues to seed from `modelValue` as before. No `recordId` needed unless the form must later reseed for a different record.

Rename fields inline, or with `mapFormData` for larger reshaping. `fieldTypes` on `form-wrapper` coerces both the initial seed and submitted data from one declaration.

### `recordId`

- type: `string | number`
- default: `null`

The stable identifier for the record that identifies the contents of this form. When the record ID changes to a new truthy value, a clean form waits for `initialData` to resolve and reseeds. A dirty form keeps its edits until they are saved or discarded.

Only needed when the same form later loads a different record. Pair it with a source that refetches when the id changes.

### `rules`

- type: `object`
- default: `{}`

All validation lives here, keyed by field name. Each value is an array of rules run against the full form data on submit. Keeping validation in one place keeps it contained rather than spread across fields, and it also allows rules that rely on other fields.

### `schema`

- type: `object`
- default: `null`

A whole-object Standard Schema (e.g. Zod, Valibot), validated against the full form data in addition to `rules`. Both run together and merge into a single per-field result: schema errors first, then `rules` errors, with identical messages deduplicated. A field is invalid if either source reports an issue.

## Events

### `submit`

Fired when the user submits the form and validation succeeds, containing submit-ready values. By submit-ready, we mean that the returned data only contains currently registered fields. When a field is unregistered, its value remains in
`v-model`, but is excluded from submit unless a field with the same name is registered again.

### `v-model`

The current values of each of the `form-field` elements contained within the form are available as an
object through `v-model`. Values remain available here after a field is unregistered, even though
they are excluded from submit payloads until the field is registered again.

## Methods

### `resetSubmitButton`

Resets the submit button's loading state. Call this after your `@submit` handler completes if it does not return a Promise, for example when the async work is deferred or the result comes back via a separate channel.

## Provide

A number of values and helpers are provided by `form-flow` under the `form` namespace.

### `fieldErrorsFor(fieldName)`

Returns all error messages for a field, deduplicating identical messages. Combines parent-owned `fieldErrors`, submit callback errors, and form-level `rules` errors into a single array. Used by `form-field` for its error display.

| Parameter   | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `fieldName` | `string` | The name of the registered field. |

### `registerField(field)`

Add a field to a form's list of fields.

| Parameter            | Type       | Description                                                |
| -------------------- | ---------- | ---------------------------------------------------------- |
| `field.name`         | `string`   | Name of the field to register.                             |
| `field.id`           | `string`   | The ID of the field, helpful for linking errors to fields. |
| `field.triggerFocus` | `function` | Method to focus on this field, used by the error summary.  |

### `unregisterField(fieldName)`

Remove a field from a form's list of fields. This does not remove its value or parent-owned errors. Its value remains in `v-model`, but is excluded from submit payloads until a field with the same name is registered again. Error-summary links and focus-on-error only target currently registered fields, so conditionally removed fields are not targeted.

| Parameter   | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `fieldName` | `string` | The name of the field to unregister. |

### `updateFieldValue(name, value)`

Allow a field to update its value in the form.

| Parameter | Type      | Description                      |
| --------- | --------- | -------------------------------- |
| `name`    | `string`  | The name of the field to update. |
| `value`   | `unknown` | The value to set.                |

### `isReadonly`

A reactive boolean that reflects the `readonly` prop. Used by `form-field` to cascade readonly state to underlying controls. Not intended for direct consumer use.

### `isFieldRequired(fieldName)`

Returns whether the form's validation rules mark a field as required. Used by form fields and related controls to cascade the required state.

| Parameter   | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `fieldName` | `string` | The name of the field to check. |

### `isCompact`

A reactive boolean that reflects the `compact` prop. Used by form layouts and fieldsets to apply compact spacing and headings.

## Styling hooks

| Attribute                    | Element | Notes                          |
| ---------------------------- | ------- | ------------------------------ |
| `data-component="form-flow"` | Root    | Scope styles to this component |

## Examples

### Basic usage

```html
<form-flow v-model="formData">
	<form-screen id="account">
		<form-field name="email">Email address</form-field>
	</form-screen>

	<form-screen id="profile">
		<form-field name="displayName">Display name</form-field>
	</form-screen>
</form-flow>
```
