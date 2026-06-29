# `form-field`

A general form component for use in [form-wrapper](/src/components/form/form-wrapper/form-wrapper.md), allowing the definition of field properties. Validation is defined on the parent `form-wrapper` via its `rules` prop.

## Slots

### `default`

Passed through to the `default` slot of the relevant form field, the `default` slot generally contains the label for the form element.

### `optional-indicator`

Content shown after the label text when the field is not required. Defaults to `(optional)`.

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
- `form-button-group`
- `date`

Any unknown type will default to `text`.

### `name`

- type: `string`
- default: `null`

The name of the field. This is required when used within a `form-wrapper` component, where it is used as the key for the form's data collection. As such, its uniqueness will be verified by `form-wrapper` when used together.

### `required`

- type: `boolean`
- default: `false`

Whether this field is required. When `true`, the `required` attribute is added to the underlying input. This is also set automatically when a `required` rule for this field is present in the parent [form-wrapper](/src/components/form/form-wrapper/form-wrapper.md)'s `rules`, but the prop allows explicit control.

Validation rules are not set on `form-field` directly. Define them on the parent `form-wrapper`'s `rules` prop instead — see the [form-wrapper docs](/src/components/form/form-wrapper/form-wrapper.md) for the available rules.

### `inputAttributes`

- type: `object`
- default: `null`

Any additional attributes to pass to the input itself, such as `autocomplete` or `aria-labelledby`.

### Additional props

Additional props are passed through to the underlying form field. Additional props may be required depending on that field, such as `options` for `radio-group`.

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
