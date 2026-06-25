# `relative-date`

`relative-date` displays a date relative to another date, such as `30 seconds ago`, `2 minutes ago`, or `yesterday`.

## Props

### `date`

- type: `string` | `number` | `Date` | `Temporal.PlainDate` | `Temporal.PlainDateTime` | `Temporal.ZonedDateTime` | `Temporal.Instant`
- default: `null`

The date to describe. Supports epoch millisecond timestamps, Date objects, Temporal date objects, or string dates in RFC 9557 format.

### `relativeTo`

- type: `string` | `number` | `Date` | `Temporal.PlainDate` | `Temporal.PlainDateTime` | `Temporal.ZonedDateTime` | `Temporal.Instant`
- default: `null`

The date to compare against. By default, the current time is used.

### `locale`

- type: `string`
- default: `undefined`

The locale to use when formatting the relative date. By default, the user's locale is used.

### `refreshInterval`

- type: `number`
- default: `1000`

How often to refresh the relative date when comparing against the current time. Set to `0` to disable automatic refreshing.

## Styling hooks

| Attribute                        | Element | Notes                          |
| -------------------------------- | ------- | ------------------------------ |
| `data-component="relative-date"` | Root    | Scope styles to this component |

## Examples

### Basic relative date

```html
<relative-date date="2025-03-29T13:14:50" />
```

### Deterministic comparison

```html
<relative-date v-bind="{ date: '2025-03-29T13:14:50', relativeTo: '2025-03-29T13:15:20' }" />
// 30 seconds ago
```
