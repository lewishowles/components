<template>
	<div v-if="haveSlices" data-component="donut-chart" data-test="donut-chart">
		<span v-if="haveLabel" :id="labelId" class="sr-only">
			<slot name="label" />
		</span>

		<svg
			v-bind="{
				...$attrs,
				role: 'img',
				'aria-labelledby': haveLabel ? labelId : undefined,
				'aria-describedby': haveDescription ? descId : undefined,
				viewBox: `0 0 ${svgSize} ${svgSize}`,
			}"
		>
			<desc v-if="haveDescription" :id="descId">
				<slot name="description" />
			</desc>

			<path
				v-for="(slice, index) in slices"
				:key="slice.id"
				class="animate-fade-in delay origin-center"
				:style="{ fill: series[index]?.color }"
				v-bind="{
					d: slice.commands,
					transform: `rotate(${slice.rotation})`,
				}"
				data-part="segment"
				data-test="donut-chart-segment"
			/>
		</svg>

		<table class="sr-only" data-test="donut-chart-data">
			<caption>
				<slot name="label" />
			</caption>

			<tbody>
				<tr v-for="(entry, index) in series" :key="index">
					<th scope="row">{{ entry.label || `Segment ${index + 1}` }}</th>
					<td>{{ entry.value }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
import { computed, useId, useSlots } from "vue";
import { useChartConfig } from "@/composables/use-chart-config/use-chart-config";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { isNumber } from "@lewishowles/helpers/number";

const props = defineProps({
	/**
	 * The segments to display, each with a `label` and `value`. Appropriate
	 * proportions are determined automatically from the sum of values. Preferred
	 * over `values` as it enables labelled table rows in the accessible output.
	 */
	segments: {
		type: Array,
		default: () => [],
	},
});

defineOptions({ inheritAttrs: false });

const slots = useSlots();

// Stable IDs for linking aria attributes to their labelling elements.
const labelId = useId();
const descId = useId();
// Base ID for slice keys, combined with each slice's index.
const sliceBaseId = useId();
// Whether a label slot has been provided.
const haveLabel = computed(() => isNonEmptySlot(slots.label));
// Whether a description slot has been provided for the SVG <desc> element.
const haveDescription = computed(() => isNonEmptySlot(slots["description"]));
// The size of the SVG viewbox.
const svgSize = 100;
// The centre point of the SVG based on its size.
const svgCentre = svgSize / 2;
// The radius of the circle.
const radius = svgCentre;
// The thickness of the doughnut.
const borderSize = 20;
// The inner radius for our doughnut hole.
const innerRadius = radius - borderSize;
// Turn our segments into an appropriate series.
const { series } = useChartConfig(props.segments);

// Whether any slices exist to render.
const haveSlices = computed(() => isNonEmptyArray(slices.value));

// The total value, from which we determine slice proportions. If any value
// isn't a number or is negative, we back out of creating the chart.
const total = computed(() => {
	const values = series.value.map((entry) => entry.value);

	if (!isNonEmptyArray(values)) {
		return 0;
	}

	if (!values.every((value) => isNumber(value) && value >= 0)) {
		return 0;
	}

	return values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
});

// Slices based on the resolved values. Returns empty if total is zero.
const slices = computed(() => {
	if (total.value === 0) {
		return [];
	}

	let cumulativePercentage = 0;

	return series.value.map((entry, index) => {
		const slice = {
			commands: getDrawCommandsForValue(entry.value),
			rotation: cumulativePercentage * 3.6,
			id: `${sliceBaseId}-${index}`,
		};

		cumulativePercentage += (entry.value / total.value) * 100;

		return slice;
	});
});

/**
 * For a given value, retrieve the commands to draw a slice of the doughnut
 * chart.
 *
 * @param  {number}  value
 *     The value for which to draw a slice.
 */
function getDrawCommandsForValue(value) {
	const angle = (value / total.value) * 360;
	const longPathFlag = angle > 180 ? 1 : 0;

	const commands = [];

	commands.push(`M ${radius} 0`);
	commands.push(
		`A ${radius} ${radius} 0 ${longPathFlag} 1 ${getCircleCoordinateForAngle(angle, radius)}`,
	);
	commands.push(`L ${getCircleCoordinateForAngle(angle, innerRadius)}`);
	commands.push(`A ${innerRadius} ${innerRadius} 0 ${longPathFlag} 0 ${svgCentre} ${borderSize}`);

	return commands.join(" ");
}

/**
 * Given an angle, determine the point on a circle with the given radius where
 * the angle would end.
 *
 * @param  {number}  angle
 *     The angle for which to get the point on the circumference.
 * @param  {number}  radius
 *     The radius of the circle for which we're getting our co-ordinate.
 */
function getCircleCoordinateForAngle(angle, radius) {
	if (!isNumber(angle) || !isNumber(radius)) {
		return "0 0";
	}

	const coordinateX = radius * Math.sin((angle * Math.PI) / 180) + 50;
	const coordinateY = -radius * Math.cos((angle * Math.PI) / 180) + 50;

	return `${coordinateX} ${coordinateY}`;
}
</script>
