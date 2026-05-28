<template>
	<span data-component="display-date" data-test="display-date">{{ displayDate }}</span>
</template>

<script setup>
import { computed } from "vue";
import { normaliseDate } from "@/helpers/date/normalise-date";

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
</script>
