<template>
	<span data-component="display-date" data-test="display-date">{{ displayDate }}</span>
</template>

<script setup>
import { computed } from "vue";
import { Temporal } from "temporal-polyfill";
import { parseDate, formatDate } from "@lewishowles/helpers/date";

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
	 * The locale to use when formatting dates. By default, the user's locale
	 * is used.
	 */
	locale: {
		type: String,
		default: undefined,
	},

	/**
	 * The formatting options to apply to the displayed date. Accepts a named
	 * format string (e.g. "date", "dateTime", "shortDate"), a Day.js-style
	 * token string (e.g. "DD/MM/YYYY"), or an Intl.DateTimeFormat options
	 * object. By default, "date" is used for date-only inputs and "dateTime"
	 * for inputs with time information.
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
	 */
	format: {
		type: [String, Object],
		default: undefined,
	},
});

// The parsed Temporal date object used for display.
const temporalDate = computed(() => {
	try {
		return parseDate(props.date);
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

	// If the user provided an explicit format, use it directly.
	if (props.format !== undefined) {
		return formatDate(props.date, props.format, { locale: props.locale });
	}

	// Auto-detect: PlainDate has no time component, everything else does.
	const formatName = temporalDate.value instanceof Temporal.PlainDate ? "date" : "dateTime";

	return formatDate(props.date, formatName, { locale: props.locale });
});
</script>
