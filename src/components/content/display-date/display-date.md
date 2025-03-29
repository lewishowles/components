# `display-date`

`display-date` displays a given ISO-formatted date in a human-readable form. The component makes use of the [Temporal API's PlainDateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime) to parse a date, and either formats the date to the user's current locale by default (using `PlainDateTime.format`), or provides options for customising the format of the date using the options provided by [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options).

**Note** that we use `PlainDateTime` and not `ZonedDateTime` as, at time of writing, `Intl.dateFormat` cannot format a `ZonedDateTime`.

## Props

### `date`

- type: `string`
- default: `null`

The date to be converted and displayed. This should be in a format that can be parsed by the [Temporal API's PlainDateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime).

## Examples

### Basic date display using the user's locale and default formatting

```html
<display-date date="2025-03-29" /> // 29/03/2025
```
