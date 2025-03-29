<template>
	<span data-test="display-date">{{ displayDate }}</span>
</template>

<script setup>
import { computed } from "vue";
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
});

// The converted date for display to the user.
const displayDate = computed(() => {
	if (!isNonEmptyString(props.date)) {
		return null;
	}

	try {
		const temporalDate = Temporal.PlainDate.from(props.date);

		// date.value = { day: day.toString(), month: month.toString(), year: year.toString() };

		return temporalDate.toLocaleString();
	} catch (error) {
		if (!import.meta.env.TEST) {
			console.log("date-display[displayDate]", error);
		}

		return null;
	}
});
</script>
