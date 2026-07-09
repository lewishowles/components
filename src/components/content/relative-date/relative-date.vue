<template>
	<time
		v-bind="{ datetime: dateTimeAttribute }"
		data-component="relative-date"
		data-test="relative-date"
	>
		<template v-if="relativeDateParts?.value === 0">
			<slot v-bind="currentTimeSlotProps">Just now</slot>
		</template>

		<template v-else>{{ relativeDate }}</template>
	</time>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { getRelativeDateParts, toEpochMilliseconds } from "@lewishowles/helpers/date";
import { capitalise as capitaliseString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * Whether to capitalise the generated relative date.
	 */
	capitalise: {
		type: Boolean,
		default: true,
	},

	/**
	 * The date to describe. Supports epoch millisecond timestamps, Date,
	 * Temporal date objects, or a string date in RFC 9557 format.
	 */
	date: {
		type: [String, Number, Date, Object],
		default: null,
	},

	/**
	 * The date to compare against. By default, the current time is used.
	 */
	relativeTo: {
		type: [String, Number, Date, Object],
		default: null,
	},

	/**
	 * The locale to use when formatting the relative date. By default, the
	 * user's locale is used.
	 */
	locale: {
		type: String,
		default: undefined,
	},

	/**
	 * How often to refresh the relative date when comparing against the current
	 * time.
	 */
	refreshInterval: {
		type: Number,
		default: 1000,
	},
});

// The current time used when no explicit comparison date is provided.
const currentEpochMilliseconds = ref(Date.now());

// The timer used to refresh relative dates that compare against now.
let refreshTimer = null;

// The date being described, represented as epoch milliseconds (used for the
// machine-readable datetime attribute).
const dateEpochMilliseconds = computed(() => {
	try {
		return toEpochMilliseconds(props.date);
	} catch (error) {
		console.error("relative-date[dateEpochMilliseconds]", error);

		return null;
	}
});

// The machine-readable date for the time element.
const dateTimeAttribute = computed(() => {
	if (dateEpochMilliseconds.value === null) {
		return null;
	}

	return new Date(dateEpochMilliseconds.value).toISOString();
});
// The effective comparison date: either the provided `relativeTo` or the
// current time (which refreshes on an interval).

const effectiveRelativeTo = computed(() => props.relativeTo ?? currentEpochMilliseconds.value);

// The raw relative date parts, used both for the "Just now" slot check and for
// formatting the display string.
const relativeDateParts = computed(() => {
	try {
		return getRelativeDateParts(props.date, effectiveRelativeTo.value);
	} catch (error) {
		console.error("relative-date[relativeDateParts]", error);

		return null;
	}
});

// The state exposed to consumers replacing the current-time label.
const currentTimeSlotProps = computed(() => ({
	...relativeDateParts.value,
	capitalise: props.capitalise,
}));

// The relative date string for display.
const relativeDate = computed(() => {
	if (relativeDateParts.value === null) {
		return null;
	}

	const formatter = new Intl.RelativeTimeFormat(props.locale, {
		numeric: "auto",
	});

	const { unit, value } = relativeDateParts.value;
	const formattedRelativeDate = formatter.format(value, unit);

	return props.capitalise ? capitaliseString(formattedRelativeDate) : formattedRelativeDate;
});

// Set up our interval to keep a relative date in sync, instead of static.
onMounted(() => {
	if (!Number.isFinite(props.refreshInterval) || props.refreshInterval <= 0) {
		return;
	}

	refreshTimer = window.setInterval(() => {
		currentEpochMilliseconds.value = Date.now();
	}, props.refreshInterval);
});

onUnmounted(() => {
	if (refreshTimer === null) {
		return;
	}

	window.clearInterval(refreshTimer);
});
</script>
