# `form-fieldset`

A fieldset represents a group of fields, containing a title and optional, but preferred, introduction.

When deciding whether to group fields, ideally if some fields are grouped, all should be, otherwise the form could look incomplete.

## Slots

### `title`

The title of this section, outlining the purpose of the grouping.

### `introduction`

Any additional information relating to this group of fields.

### `default`

The content of the fieldset, which will be wrapped in a [form-layout](/src/components/form/form-layout/form-layout.md) component.

## Props

### `headingLevel`

- type: `string`
- default: `h2`

The heading level to use this fieldset.

## Examples

### Basic fieldset

```html
<form-fieldset>
	<template #title>
		Your details
	</template>

	<template #introduction>
		Your details are used in order to maintain your account.
	</template>

	<form-field name="your_name">
		Your name
	</form-field>
</form-fieldset>

<form-fieldset>
	<template #title>
		Your contact details
	</template>

	<template #introduction>
		We will only use these details to contact you about your account.
	</template>

	<form-field type="email" name="email_address">
		Email address
	</form-field>
</form-fieldset>
```
