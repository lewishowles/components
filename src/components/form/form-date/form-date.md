# `form-date`

`form-date` is a date component that aims to remove any confusion when it comes to dates by providing three separate, labelled inputs.

At this time, the component doesn't include a calendar component, which should only really be used when the user needs to select a date in the recent past or near future.

`form-date` models its date as `{ day, month, year }`, allowing any further manipulation to be done easily.

## Slots

### `day-label`

The label for the "Day" field.

### `month-label`

The label for the "Month" field.

### `year-label`

The label for the "Year" field.

## Props

### `required`

- type: `boolean`
- default: `false`

## Examples

### Basic date

```html
<form-date v-model="date" />
```
