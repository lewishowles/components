<template>
	<div
		v-bind="rootAttributes"
		:class="rootClasses"
		role="meter"
		data-component="spark-bar"
		data-test="spark-bar"
	>
		<div :class="trackMergedClasses" data-part="track">
			<div :class="barMergedClasses" data-part="bar" :style="{ width: `${percentageValue}%` }" />
		</div>

		<div :class="valueMergedClasses" data-part="value" data-test="spark-bar-value">
			<slot v-bind="{ current: internalValue, min, max, percentage: percentageValue }">
				{{ percentageValue }}%
			</slot>
		</div>
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed, useAttrs } from "vue";
import { cn } from "@/utilities/cn.js";

defineOptions({ inheritAttrs: false });

const props = defineProps({
	/**
	 * The current value represented by the spark bar.
	 */
	current: {
		type: Number,
		default: 0,
	},

	/**
	 * The minimum value of the spark bar, used to determine how much of the
	 * bar is filled based on the current value.
	 */
	min: {
		type: Number,
		default: 0,
	},

	/**
	 * The maximum value of the spark bar, used to determine how much of the
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
		default: undefined,
	},

	/**
	 * Classes to apply to the bar, which indicates the current value.
	 */
	barClasses: {
		type: [String, Array, Object],
		default: undefined,
	},

	/**
	 * Classes to apply to the value display.
	 */
	valueClasses: {
		type: [String, Array, Object],
		default: undefined,
	},
});

const attributes = useAttrs();

// Classes for the root meter element.
const rootClasses = computed(() => cn("flex items-center gap-4", attributes.class));

// The attributes to forward to the root, without duplicate class handling.
const attrsWithoutClass = computed(() => {
	const { class: _omitted, ...rest } = attributes;

	return rest;
});

// Attributes applied to the root meter element.
const rootAttributes = computed(() => ({
	...attrsWithoutClass.value,
	"aria-valuenow": internalValue.value,
	"aria-valuemin": props.min,
	"aria-valuemax": props.max,
}));

// Classes for the track behind the bar.
const trackMergedClasses = computed(() =>
	cn("grow h-1 rounded-full bg-grey-200 dark:bg-white/20", props.trackClasses),
);

// Classes for the bar showing the current value.
const barMergedClasses = computed(() =>
	cn("h-full rounded-full bg-primary transition-all ease-out", props.barClasses),
);

// Classes for the visible value.
const valueMergedClasses = computed(() => cn("text-sm", props.valueClasses));

// The internal current value, clamped between min and max.
const internalValue = computed(() => clamp(props.current, props.min, props.max));

// The percentage bar width - as a whole number between 0 and 100.
const percentageValue = computed(() => {
	if (props.max <= props.min) {
		return 0;
	}

	return Math.round(((internalValue.value - props.min) / (props.max - props.min)) * 100);
});
</script>
