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

## To do

- Determine the field type
- Determine any additional props to pass beyond the defaults
- Pass through slots
