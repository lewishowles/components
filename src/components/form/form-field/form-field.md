# `form-field`

A general form component for use in [form-wrapper](/src/components/form/form-wrapper/form-wrapper.md), allowing the definition of field properties. Validation is defined on the parent `form-wrapper` via its `rules` prop.

## Slots

### `default`

Passed through to the `default` slot of the relevant form field, the `default` slot generally contains the label for the form element.

### `optional-indicator`

Content shown after the label text when the field is not required. Defaults to `(optional)`.

### `empty-option-label`

Content for a select field's empty option. Defaults to the field label.

### `option`

Custom content for one option in a checkbox or radio group. Receives `option`, `selected`, `id`, and `name`.

### `description`

Supporting text shown beneath a checkbox label.

### `remove-button-label`

Content for a file field's remove button. Receives `files`, an array containing the current `File` objects.

## Props

### `type`

- type: `string`
- default: `text`

The type of field. Known types include:

- `text`
- `email`
- `password`
- `textarea`
- `select`
- `checkbox`
- `checkbox-group`
- `radio-group`
- `button-group`
- `date`
- `file`

Any unknown type will default to `text`.

### `name`

- type: `string`
- default: `null`

The name of the field. This is required when used within a `form-wrapper` component, where it is used as the key for the form's data collection. As such, its uniqueness will be verified by `form-wrapper` when used together.

### `required`

- type: `boolean`
- default: `false`

Whether this field is required. When `true`, the `required` attribute is added to the underlying input. This is also set automatically when a `required` rule for this field is present in the parent [form-wrapper](/src/components/form/form-wrapper/form-wrapper.md)'s `rules`, but the prop allows explicit control.

Validation rules are not set on `form-field` directly. Define them on the parent `form-wrapper`'s `rules` prop instead; see the [form-wrapper docs](/src/components/form/form-wrapper/form-wrapper.md) for the available rules.

### `displayLabel`

- type: `boolean`
- default: `true`

Whether to display the label for `text`, `select`, and `checkbox` fields. When `false`, the label remains available to screen readers but is visually hidden.

### `multiple`

- type: `boolean`
- default: `false`

Whether a `file` field allows selecting more than one file. When enabled, the field's `v-model` contains an array of `File` objects or `null` instead of a single `File` or `null`. The remove button clears the complete current selection.

### `inputAttributes`

- type: `object`
- default: `null`

Any additional attributes to pass to the input itself, such as `autocomplete` or `aria-labelledby`.

### Additional props

Some field types expose additional props. For example, `multiple` applies to `file` fields, while option-bearing fields use their documented `options` prop.

## Events

### `v-model`

The current value of the underlying form field will be available via `v-model`.

## Examples

### Text field

```html
<form-field name="username">Username</form-field>
```

### Checkbox

```html
<form-field type="checkbox" name="accept_terms">
	By submitting this form, you accept our <link-tag v-bind="{ href: "/terms" external: true }">terms and conditions of sale</link-tag>.
</form-field>
```

### File

```html
<form-field type="file" name="supporting_document">Supporting document</form-field>
```
