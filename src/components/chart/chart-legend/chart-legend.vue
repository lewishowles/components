<template>
	<dl
		v-if="haveSeries"
		:class="rootClasses"
		v-bind="attrsWithoutClass"
		data-component="chart-legend"
		data-test="chart-legend"
	>
		<div
			v-for="entry in props.series"
			:key="entry.label"
			class="flex items-center gap-2"
			data-part="entry"
			data-test="chart-legend-entry"
		>
			<dt class="flex items-center gap-2" data-part="label" data-test="chart-legend-label">
				<span
					aria-hidden="true"
					class="size-3 shrink-0 rounded-sm"
					:style="{ background: entry.color }"
				/>
				{{ entry.label }}
			</dt>
			<dd v-if="showValues" class="font-medium" data-part="value" data-test="chart-legend-value">
				{{ formattedValue(entry.value) }}
			</dd>
		</div>
	</dl>
</template>

<script setup>
import { cn } from "@/utilities/cn.js";
import { computed, useAttrs } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isFunction } from "@lewishowles/helpers/general";

defineOptions({ inheritAttrs: false });

const props = defineProps({
	/**
	 * The series to display, usually from `useChartConfig`. Each entry should
	 * have `label`, `value`, and `color` properties.
	 */
	series: {
		type: Array,
		default: () => [],
	},

	/**
	 * Whether to display the value alongside each label and colour pair.
	 */
	showValues: {
		type: Boolean,
		default: true,
	},

	/**
	 * An optional function to format each value for display. Receives the raw
	 * value and returns a string. Falls back to the raw value when not
	 * provided.
	 */
	formatValue: {
		type: Function,
		default: undefined,
	},

	/**
	 * The layout direction of the legend entries.
	 */
	orientation: {
		type: String,
		default: "vertical",
		validator: (value) => ["horizontal", "vertical"].includes(value),
	},
});

const attributes = useAttrs();

// Whether any series entries exist to render.
const haveSeries = computed(() => isNonEmptyArray(props.series));

// Classes for the root element, merging defaults, orientation, and any provided classes.
const rootClasses = computed(() =>
	cn(
		"flex gap-x-6 gap-y-2",
		{
			"flex-row flex-wrap": props.orientation === "horizontal",
			"flex-col": props.orientation === "vertical",
		},
		attributes.class,
	),
);

// All attributes except class, spread onto the root element separately so that
// class can be handled via cn() without doubling up.
const attrsWithoutClass = computed(() => {
	const { class: _omitted, ...rest } = attributes;

	return rest;
});

/**
 * Format a value for display, using the provided `formatValue` callback when
 * available, or falling back to the raw value.
 *
 * @param  {number}  value
 *     The raw segment value.
 */
function formattedValue(value) {
	if (isFunction(props.formatValue)) {
		return props.formatValue(value);
	}

	return value;
}
</script>
