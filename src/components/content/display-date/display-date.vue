<template>
	<span data-test="display-date">{{ displayDate }}</span>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { Temporal } from "temporal-polyfill";

const props = defineProps({
	/**
	 * The date to convert and display.
	 */
	date: {
		type: String,
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
		default: () => ({}),
	},
});

// The class instance we use for the date. If it contains a [, we use a
// ZonedDateTime. Otherwise, if it contains a T, we use a `PlainDateTime`, and
// otherwise we use a `PlainDate`.
const temporalClass = computed(() => {
	if (!isNonEmptyString(props.date)) {
		return null;
	}

	if (props.date.includes("[")) {
		return "ZonedDateTime";
	} else if (props.date.includes("T")) {
		return "PlainDateTime";
	}

	return "PlainDate";
});

// The converted date for display to the user.
const displayDate = computed(() => {
	if (!isNonEmptyString(props.date)) {
		return null;
	}

	try {
		const temporalDate = Temporal[temporalClass.value].from(props.date);

		if (!isNonEmptyString(props.locale) && !isNonEmptyObject(props.format)) {
			return temporalDate.toLocaleString();
		}

		return temporalDate.toLocaleString(props.locale, props.format);
	} catch (error) {
		console.log("date-display[displayDate]", error);

		return null;
	}
});

window.Temporal = Temporal;
</script>
