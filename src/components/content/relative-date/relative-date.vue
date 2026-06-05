<template>
	<time
		v-bind="{ datetime: dateTimeAttribute }"
		data-component="relative-date"
		data-test="relative-date"
	>
		<template v-if="relativeDateParts?.value === 0">
			<slot v-bind="relativeDateParts">Just now</slot>
		</template>

		<template v-else>{{ relativeDate }}</template>
	</time>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { normaliseDateToEpochMilliseconds } from "@/helpers/date/normalise-date";

const props = defineProps({
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

// Relative units supported by Intl.RelativeTimeFormat.
const relativeUnits = {
	SECOND: "second",
	MINUTE: "minute",
	HOUR: "hour",
	DAY: "day",
	MONTH: "month",
	YEAR: "year",
};

// Millisecond thresholds for each supported relative unit.
const relativeUnitMilliseconds = {
	SECOND: 1000,
	MINUTE: 60 * 1000,
	HOUR: 60 * 60 * 1000,
	DAY: 24 * 60 * 60 * 1000,
	MONTH: 30 * 24 * 60 * 60 * 1000,
	YEAR: 365 * 24 * 60 * 60 * 1000,
};

// The current time used when no explicit comparison date is provided.
const currentEpochMilliseconds = ref(Date.now());

// The timer used to refresh relative dates that compare against now.
let refreshTimer = null;

// The date being described, represented as epoch milliseconds.
const dateEpochMilliseconds = computed(() => {
	try {
		return normaliseDateToEpochMilliseconds(props.date);
	} catch (error) {
		console.error("relative-date[dateEpochMilliseconds]", error);

		return null;
	}
});

// The comparison date, represented as epoch milliseconds.
const relativeToEpochMilliseconds = computed(() => {
	if (props.relativeTo === null) {
		return currentEpochMilliseconds.value;
	}

	try {
		return normaliseDateToEpochMilliseconds(props.relativeTo);
	} catch (error) {
		console.error("relative-date[relativeToEpochMilliseconds]", error);

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

// The raw relative date parts.
const relativeDateParts = computed(() => {
	if (dateEpochMilliseconds.value === null || relativeToEpochMilliseconds.value === null) {
		return null;
	}

	return getRelativeDateParts(dateEpochMilliseconds.value, relativeToEpochMilliseconds.value);
});

// The relative date string for display.
const relativeDate = computed(() => {
	if (relativeDateParts.value === null) {
		return null;
	}

	const formatter = new Intl.RelativeTimeFormat(props.locale, {
		numeric: "always",
	});

	const { unit, value } = relativeDateParts.value;

	return formatter.format(value, unit);
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

/**
 * Get the relative value and unit between two dates.
 *
 * @param  {number}  date
 *     The date being described, as epoch milliseconds.
 * @param  {number}  relativeTo
 *     The date to compare against, as epoch milliseconds.
 */
function getRelativeDateParts(date, relativeTo) {
	const difference = date - relativeTo;

	// Avoid minute differences in time showing as in the future or past.
	if (Math.abs(difference) < 1000) {
		return {
			unit: "second",
			value: 0,
		};
	}

	const absoluteDifference = Math.abs(difference);
	const direction = difference > 0 ? 1 : -1;
	const { amount, unit } = getRelativeDateAmount(absoluteDifference);

	return {
		unit,
		value: direction * amount,
	};
}

/**
 * Get the best relative unit for an absolute time difference.
 *
 * @param  {number}  difference
 *     The absolute difference between two dates, as milliseconds.
 */
function getRelativeDateAmount(difference) {
	const seconds = Math.floor(difference / relativeUnitMilliseconds.SECOND);

	if (seconds < 60) {
		return { amount: seconds, unit: relativeUnits.SECOND };
	}

	const minutes = Math.floor(difference / relativeUnitMilliseconds.MINUTE);

	if (minutes < 60) {
		return { amount: minutes, unit: relativeUnits.MINUTE };
	}

	const hours = Math.floor(difference / relativeUnitMilliseconds.HOUR);

	if (hours < 24) {
		return { amount: hours, unit: relativeUnits.HOUR };
	}

	const days = Math.floor(difference / relativeUnitMilliseconds.DAY);

	if (days < 30) {
		return { amount: Math.max(1, days), unit: relativeUnits.DAY };
	}

	const months = Math.floor(difference / relativeUnitMilliseconds.MONTH);

	if (months < 12) {
		return { amount: months, unit: relativeUnits.MONTH };
	}

	return {
		amount: Math.floor(difference / relativeUnitMilliseconds.YEAR),
		unit: relativeUnits.YEAR,
	};
}
</script>
