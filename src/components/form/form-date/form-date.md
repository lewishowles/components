# `form-date`

`form-date` is a date component that aims to remove any confusion when it comes to dates by providing three separate, labelled inputs.

At this time, the component doesn't include a calendar component, which should only really be used when the user needs to select a date in the recent past or near future.

`form-date` models its date as `{ day, month, year }`, allowing any further manipulation to be done easily.

## Slots

### `default`

The default slot contains the label of the field.

_Note that a label is always required, even if a label is not shown to the user, as it will be critical for screen readers. This component will show an error if no label is provided._

### `optional-indicator`

Content shown after the label text when the field is not required. Defaults to `(optional)`.

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

### `date-helper-status`

The screen-reader status announcement shown after a date helper button (see the `dateHelpers` prop) is activated. Receives a `date` slot prop containing the resolved, formatted date. Defaults to `Date set to {date}.`.

Only rendered when `dateHelpers` resolves at least one valid entry.

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

### `dateHelpers`

- type: `array`
- default: `[]`

Optional quick-select date buttons, rendered beneath the date inputs. Each entry is `{ label, unit, value }`:

- `label`: the button text, e.g. `"Today"`, `"Tomorrow"`, `"+2 days"`.
- `unit`: one of `"day"`, `"week"`, `"month"`, `"year"`.
- `value`: an integer amount of `unit` to add relative to today. `0` is valid (e.g. "Today"); negative values select a date in the past.

Invalid entries (missing label, unsupported unit, non-integer value) are silently dropped rather than rendered broken.

Each button press is idempotent: the resulting date is always calculated relative to today, not relative to the field's current value, so repeated presses of "+2 days" always land two days from today rather than accumulating. Activating a button keeps focus on that button rather than moving focus into the date inputs, and announces the resolved date via the `date-helper-status` slot.

## Methods

### toString

Retrieve a pre-formatted string representation of the current (date only) in [RFC 9557 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate#rfc_9557_format).

### setDateFromIsoString

Set the current `day`, `month`, and `year`, as parsed from an [RFC 9557 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate#rfc_9557_format) date string.

### triggerFocus

Focus the "day" input of this field.

## Styling hooks

| Attribute                    | Element | Notes                               |
| ---------------------------- | ------- | ----------------------------------- |
| `data-component="form-date"` | Root    | Scope styles to this component      |
| `data-invalid`               | Root    | Present when the field has an error |

## Examples

### Basic date

```html
<form-date v-model="date">When did you first request help?</form-date>
```
