# `form-date`

`form-date` is a date component that aims to remove any confusion when it comes to dates by providing three separate, labelled inputs.

At this time, the component doesn't include a calendar component, which should only really be used when the user needs to select a date in the recent past or near future.

`form-date` models its date as `{ day, month, year }`, allowing any further manipulation to be done easily.

## Slots

### `default`

The default slot contains the label of the field.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `introduction`

Any additional text to introduce this field, which appears between the label and the inputs.

### `day-label`

The label for the "Day" field.

### `month-label`

The label for the "Month" field.

### `year-label`

The label for the "Year" field.

### `error`

Any error text to display below the field.

### `help`

Any help text to display below the field.

## Props

### `id`

- type: `string`
- default: `null`

Any ID to use as a basis for this field. If an ID is not provided, one will be generated at random. IDs provided will be suffixed with `day`, `month` and `year` as appropriate to differentiate the fields.

Note that when providing an ID, please make sure that it is unique to avoid any unforeseen issues.

### `dayPlaceholder`

- type: `string`
- default: `null`

Any placeholder to show in the "Day" field. Do not use a placeholder for critical information. Always use the label and help text as priorities.

### `monthPlaceholder`

- type: `string`
- default: `null`

Any placeholder to show in the "Month" field. Do not use a placeholder for critical information. Always use the label and help text as priorities.

### `yearPlaceholder`

- type: `string`
- default: `null`

Any placeholder to show in the "Year" field. Do not use a placeholder for critical information. Always use the label and help text as priorities.

## Methods

### toString

Retrieve a pre-formatted string representation of the current (date only) in [RFC 9557 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate#rfc_9557_format).

### setDateFromIsoString

Set the current `day`, `month`, and `year`, as parsed from an [RFC 9557 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate#rfc_9557_format) date string.

### triggerFocus

Focus the "day" input of this field.

## Examples

### Basic date

```html
<form-date v-model="date">
	When did you first request help?
</form-date>
```
