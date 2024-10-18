<template>
	<div
		v-bind="{
			'class': trackClasses,
			'aria-label': label,
			'aria-valuenow': internalValue,
			'aria-valuemin': min,
			'aria-valuemax': max,
			'aria-valuetext': `${percentageBarWidth}%`,
		}"
		role="progressbar"
		data-test="progress-bar"
	>
		<div
			class="transition-all ease-out"
			:class="barClasses"
			:style="{ width: `${percentageBarWidth}%` }"
		/>
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed } from "vue";

const props = defineProps({
	/**
	 * The current value represented by the progress bar.
	 */
	value: {
		type: Number,
		default: 0,
	},

	/**
	 * The minimum value of the progress bar, used to determine how much of the
	 * bar is filled based on the current value.
	 */
	min: {
		type: Number,
		default: 0,
	},

	/**
	 * The maximum value of the progress bar, used to determine how much of the
	 * bar is filled based on the current value.
	 */
	max: {
		type: Number,
		default: 100,
	},

	/**
	 * Classes to apply to the track, which is the background behind the bar.
	 */
	trackClasses: {
		type: [String, Array, Object],
		default: "h-4 rounded-full bg-grey-200 dark:bg-grey-700",
	},

	/**
	 * Classes to apply to the bar, which indicates the current value.
	 */
	barClasses: {
		type: String,
		default: "h-full rounded-full bg-purple-500",
	},

	// i18n

	/**
	 * The label for the progress bar. This label is hidden by default, but is
	 * included for accessibility purposes.
	 */
	label: {
		type: String,
		default: "Loading…",
	},
});

// The internal current value, allowing us to bind the current value to the
// provided minimum and maximum.
const internalValue = computed(() => clamp(props.value, props.min, props.max));

// The relative width of the bar, representing the current value.
const barWidth = computed(() => {
	if (props.max <= 0) {
		return 0;
	}

	return (internalValue.value - props.min) / props.max;
});

// The percentage bar width - as a number between 0 and 100.
const percentageBarWidth = computed(() => barWidth.value * 100);
</script>
