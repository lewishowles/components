# `display-date`

`display-date` displays a given date in a human-readable form. The component accepts strings, epoch millisecond timestamps, Date instances, and Temporal date objects, then formats the date to the user's current locale by default. Custom formatting can be provided using [the options provided by `toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime/toLocaleString#options).

**Note** string dates are parsed into the closest Temporal type. A string containing `[` is treated as a `ZonedDateTime`; an instant string ending in `Z` or an offset such as `+01:00` is converted to an `Instant`; a string containing `T` is treated as a `PlainDateTime`; otherwise a `PlainDate` is used. Timestamps, Date instances, and Temporal instants are converted to `Instant` values.

## Props

### `date`

- type: `string` | `number` | `Date` | `Temporal.PlainDate` | `Temporal.PlainDateTime` | `Temporal.ZonedDateTime` | `Temporal.Instant`
- default: `null`

The date to convert and display. Supports epoch millisecond timestamps, Date objects, Temporal date objects, or string dates in [RFC 9557 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime#rfc_9557_format).

### `locale`

- type: `string`
- default: `undefined`

The locale to use when formatting dates. By default, the user's locale is used.

### `format`

- type: `string` | `object`
- default: `undefined`

The formatting to apply to the displayed date. Accepts a named format string (e.g. `"date"`, `"dateTime"`, `"shortDate"`), a Day.js-style token string (e.g. `"DD/MM/YYYY"`), or an [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options) options object. By default, `"date"` is used for date-only inputs and `"dateTime"` for inputs with time information.

## Styling hooks

| Attribute                       | Element | Notes                          |
| ------------------------------- | ------- | ------------------------------ |
| `data-component="display-date"` | Root    | Scope styles to this component |

## Examples

### Basic date display using the user's locale and default formatting

```html
<display-date date="2025-03-29" />
// 29 Mar 2025
```

### Date instance

```html
<display-date v-bind="{ date: new Date(2025, 2, 29, 13, 15, 20) }" />
// 29 Mar 2025, 13:15
```

### Timestamp

```html
<display-date v-bind="{ date: 1743254120000 }" />
// 29 Mar 2025, 13:15
```

### Custom formatting

```html
<!-- Samstag, 29. März 2025 um 13:15 -->
<display-date v-bind="{ date: '2025-03-29T13:15:20', locale: 'de-DE', format }" />
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
