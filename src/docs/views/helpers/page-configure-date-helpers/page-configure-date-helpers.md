<!-- Parallel prose copy of page-configure-date-helpers.vue; no runtime Markdown loader exists yet, keep the two in sync until docs-metadata-consolidation lands. -->

# `configureDateHelpers`

`configureDateHelpers` sets project-wide defaults for parsing and formatting dates. Configure it once so date helpers use the same locale, timezone, input format, default format, and named output formats.

The built-in named formats are `date`, `dateTime`, and `shortDate`. [`display-date`](/content/display-date) and [`form-date`](/form/form-date) honour this configuration when they use their default formatting.

## Parameters

### `config`

- type: `object`

The optional date helper defaults to merge into the active configuration.

| Option          | Type                                                   | Description                                                                                                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `locale`        | `string`                                               | The [BCP 47](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang#language_tag_syntax) locale used by date formatters.                                                                                                                                                   |
| `timeZone`      | `string`                                               | The timezone used to resolve plain dates and date-times to a specific moment, such as `"Europe/London"`; see the [`timeZone` option in `Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#timezone). |
| `inputFormat`   | `string`                                               | The [Day.js-style token format](https://day.js.org/docs/en/parse/string-format) used when parsing non-ISO strings.                                                                                                                                                                           |
| `defaultFormat` | `string`                                               | A key from `formats`, such as `"date"`, `"dateTime"`, or `"shortDate"`, used when a format is not provided.                                                                                                                                                                                  |
| `formats`       | `Record<string, string \| Intl.DateTimeFormatOptions>` | A map of named output formats. Each value is a Day.js-style token string or an `Intl.DateTimeFormatOptions` object.                                                                                                                                                                          |

The default `formats` map is `{ date: { dateStyle: "medium" }, dateTime: { dateStyle: "medium", timeStyle: "short" }, shortDate: "DD/MM/YYYY" }`.

`formats.date`, `formats.dateTime`, and `formats.shortDate` follow the same shape as any other entry in `formats`: either a Day.js-style token string or an `Intl.DateTimeFormatOptions` object. Projects can override these three built-in formats, or add named formats of their own.

## Returns

### `config`

- type: `object`

The active date helper configuration, including the merged defaults and named formats. Calling `configureDateHelpers` without arguments returns the current configuration.

## Example

Configure the shared date defaults when the application starts:

```js
import { configureDateHelpers } from "@lewishowles/helpers/date";

configureDateHelpers({
	locale: "en-US",
	timeZone: "America/New_York",
	defaultFormat: "date",
	formats: {
		date: "MM/DD/YYYY",
		dateTime: { dateStyle: "medium", timeStyle: "short" },
	},
});
```
