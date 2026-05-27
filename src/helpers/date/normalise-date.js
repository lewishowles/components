import { isNonEmptyString } from "@lewishowles/helpers/string";
import { Temporal } from "temporal-polyfill";

/**
 * Convert supported date inputs into the Temporal type that best preserves
 * their meaning.
 *
 * @param  {unknown}  date
 *     The date-like value to convert.
 */
export function normaliseDate(date) {
	if (date instanceof Date) {
		return normaliseDateInstance(date);
	}

	if (typeof date === "number") {
		return normaliseTimestamp(date);
	}

	if (date instanceof Temporal.Instant) {
		return normaliseInstant(date);
	}

	if (isTemporalDate(date)) {
		return date;
	}

	if (isNonEmptyString(date)) {
		return normaliseStringDate(date);
	}

	return null;
}

/**
 * Convert supported date inputs into epoch milliseconds.
 *
 * @param  {unknown}  date
 *     The date-like value to convert.
 */
export function normaliseDateToEpochMilliseconds(date) {
	const temporalDate = normaliseDate(date);

	if (temporalDate === null) {
		return null;
	}

	if (temporalDate instanceof Temporal.ZonedDateTime) {
		return temporalDate.toInstant().epochMilliseconds;
	}

	if (temporalDate instanceof Temporal.PlainDate) {
		return temporalDate
			.toPlainDateTime(Temporal.PlainTime.from("00:00"))
			.toZonedDateTime(Temporal.Now.timeZoneId())
			.toInstant().epochMilliseconds;
	}

	return temporalDate.toZonedDateTime(Temporal.Now.timeZoneId()).toInstant().epochMilliseconds;
}

/**
 * Convert an epoch millisecond timestamp to local calendar fields for display.
 *
 * @param  {number}  date
 *     The timestamp to convert.
 */
function normaliseTimestamp(date) {
	if (!Number.isFinite(date)) {
		return null;
	}

	return normaliseInstant(Temporal.Instant.fromEpochMilliseconds(date));
}

/**
 * Convert a Date instance using calendar fields.
 *
 * @param  {Date}  date
 *     The Date instance to convert.
 */
function normaliseDateInstance(date) {
	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return Temporal.PlainDateTime.from({
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: date.getSeconds(),
		millisecond: date.getMilliseconds(),
	});
}

/**
 * Convert an instant to local calendar fields for display.
 *
 * @param  {Temporal.Instant}  date
 *     The instant to convert.
 */
function normaliseInstant(date) {
	return date.toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDateTime();
}

/**
 * Convert a string date to the most appropriate Temporal type.
 *
 * @param  {string}  date
 *     The date string to convert.
 */
function normaliseStringDate(date) {
	// 2025-03-29[America/New_York]
	if (date.includes("[")) {
		return Temporal.ZonedDateTime.from(date);
	}

	// 2025-03-29T13:15:20Z or 2025-03-29T13:15:20+01:00
	if (date.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(date)) {
		return normaliseInstant(Temporal.Instant.from(date));
	}

	// 2025-03-29T13:15:20
	if (date.includes("T")) {
		return Temporal.PlainDateTime.from(date);
	}

	return Temporal.PlainDate.from(date);
}

/**
 * Check whether a value is one of the Temporal date types this helper can use.
 *
 * @param  {unknown}  date
 *     The value to check.
 */
function isTemporalDate(date) {
	return [Temporal.PlainDate, Temporal.PlainDateTime, Temporal.ZonedDateTime].some(
		(temporalDateType) => date instanceof temporalDateType,
	);
}
