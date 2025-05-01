# `form-field`

A general form component for use in [form-wrapper](/src/components/form/form-wrapper/form-wrapper.md), allowing the definition of field properties and validation rules.

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
- `select`
- `checkbox`
- `radio-group`
- `button-group`
- `date`

Any unknown type will default to `text`.

### `name`

- type: `string`
- default: `null`

The name of the field. This is required when used within a `form-wrapper` component, where it is used as the key for the form's data collection. As such, its uniqueness will be verified by `form-wrapper` when used together.

### `validation`

- type: `array`
- default: `[]`

Any validation to apply to the field. This is used with the externally-facing `validate` function, as well as applying attributes to the field as necessary, such as `required`.

Each entry in validation requires at least a `rule`, outlining the type of validation, and a `message`, which is used if validation fails. Available rules and properties include:

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

### Additional props

Additional props are passed through to the underlying form field. Additional props may be required depending on that field, such as `options` for `radio-group`.

## Events

### `v-model`

The current value of the underlying form field will be available via `v-model`.

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
