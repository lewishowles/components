# `form-field`

## Slots

### `default`

Passed through to the `default` slot of the relevant form field, the `default` slot generally contains the label for the form element.

## Props

### `type`

- type: `string`
- default: `text`

The type of field. Known types include:

- `text`
- `email`
- `password`
- `textarea`
- `checkbox`
- `radio-group`
- `button-group`

Any unknown type will default to `text`.

### `name`

- type: `string`
- default: `null`

The name of the field. This is required when used within a `form-wrapper` component, where it is used as the key for the form's data collection. As such, its uniqueness will be verified by `form-wrapper` when used together.

### `validation`

- type: `array`
- default: `[]`

Any validation to apply to the field. This is used with the externally-facing `validate` function, as well as applying attributes to the field as necessary such as `required`.

Each entry in validation requires at least a `rule`, outlining the type of validation, and a `message`, which is used if validation fails. Available rules and properties include:

#### `required`

`[{ rule: "required", message: "Please enter your name" }]`

Requires a value to be set. Adds the `required` attribute to the field automatically.

### Additional props

Additional props are passed through to the underlying form field. Additional props may be required depending on that field, such as `options` for `radio-group`.

## Events

### `v-model`

The current value of the underlying form field will be available via `v-model`.

## Methods

### `method`

...

## Examples

### Text field

```html
<form-field name="username">
	Username
</form-field>
```

### Checkbox

```html
<form-field type="checkbox" name="accept_terms">
	By submitting this form, you accept our <link-tag v-bind="{ href: "/terms" external: true }">terms and conditions of sale</link-tag>.
</form-field>
```
