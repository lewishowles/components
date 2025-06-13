# `display-date`

`display-date` displays a given ISO-formatted date in a human-readable form. The component makes use of the [Temporal API's PlainDateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime) to parse a date, and either formats the date to the user's current locale by default, or provides options for customising the format of the date using [the options provided by `toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime/toLocaleString#options).

**Note** if the provided date contains `[` to indicate a time zone component, we use `ZonedDateTime`. If it does not, but contains `T` for a time component, we use a `PlainDateTime`, otherwise a `PlainDate` is used. Note that these different options produce different outputs via `toLocaleString` by default.

## Props

### `date`

- type: `string`
- default: `null`

The date to be converted and displayed. This should be in a format that can be parsed by the [Temporal API's PlainDateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime).

### `locale`

- type: `string`
- default: `undefined`

The locale to use when formatting dates. By default, the user's locale is used.

### `format`

- type: `object`
- default: `null`

The formatting options to apply to the displayed date, as defined by [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options).

## Examples

### Basic date display using the user's locale and default formatting

```html
<display-date date="2025-03-29" /> // 29/03/2025
```

### Custom formatting

```html
<display-date v-bind="{ date: '2025-03-29T13:15:20', locale: 'de-DE', format }" /> // Samstag, 29. März 2025 um 13:15
```

```javascript
const format = {
	year: "numeric",
	day: "2-digit",
	weekday: "long",
	month: "long",
	hour: "numeric",
	dayPeriod: "long",
	minute: "numeric",
};
```
