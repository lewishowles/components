<template>
	<span data-test="display-date">{{ displayDate }}</span>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { Temporal } from "temporal-polyfill";

const props = defineProps({
	/**
	 * The date to convert and display. Supports epoch millisecond timestamps,
	 * Date, Temporal date objects, or a string date in RFC 9557 format.
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime#rfc_9557_format
	 */
	date: {
		type: [String, Number, Date, Object],
		default: null,
	},

	/**
	 * The locale to use when formatting dates. By default, the user's locale is
	 * used.
	 */
	locale: {
		type: String,
		default: undefined,
	},

	/**
	 * The formatting options to apply to the displayed date, as defined by
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
	 */
	format: {
		type: Object,
		default: () => undefined,
	},
});

// The Temporal date object used for display.
const temporalDate = computed(() => {
	try {
		return normaliseDate(props.date);
	} catch (error) {
		console.error("date-display[temporalDate]", error);

		return null;
	}
});

// The converted date for display to the user.
const displayDate = computed(() => {
	if (temporalDate.value === null) {
		return null;
	}

	return temporalDate.value.toLocaleString(props.locale, props.format ?? undefined);
});

/**
 * Convert supported date inputs into the Temporal type that best preserves
 * their meaning.
 *
 * @param  {unknown}  date
 *     The date-like value passed to the component.
 */
function normaliseDate(date) {
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
 * Check whether a value is one of the Temporal date types this component can
 * format directly.
 *
 * @param  {unknown}  date
 *     The value to check.
 */
function isTemporalDate(date) {
	return [Temporal.PlainDate, Temporal.PlainDateTime, Temporal.ZonedDateTime].some(
		(temporalDateType) => date instanceof temporalDateType,
	);
}
</script>
