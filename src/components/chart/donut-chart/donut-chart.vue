<template>
	<svg v-if="haveSlices" :viewBox="`0 0 ${svgSize} ${svgSize}`" data-test="donut-chart">
		<path
			v-for="(slice, index) in slices"
			:key="slice.id"
			class="origin-center"
			v-bind="{
				d: slice.commands,
				transform: `rotate(${slice.rotation})`,
				fill: getNextColour(index)
			}"
			data-test="donut-chart-segment"
		/>
	</svg>
</template>

<script setup>
import { chartColours } from "@lewishowles/helpers/chart";
import { computed } from "vue";
import { getNextIndex } from "@lewishowles/helpers/array";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNumber } from "@lewishowles/helpers/number";
import { nanoid } from "nanoid";

const props = defineProps({
	/**
	 * The values to represent in this donut chart. Appropriate proportions will
	 * be determined automatically based on the sum of these values.
	 *
	 * If any non-numbers, or negative numbers, appear in the list, a chart will
	 * not be created.
	 */
	values: {
		type: Array,
		required: true,
	},
});

// The size of the SVG viewbox.
const svgSize = 100;
// The centre point of the SVG based on its size.
const svgCentre = svgSize / 2;
// The radius of the circle.
const radius = svgCentre;
// The thickness of the donut.
const borderSize = 20;
// The inner radius for our donut hole.
const innerRadius = radius - borderSize;
// Whether any slices exist to render.
const haveSlices = computed(() => isNonEmptyArray(slices.value));

// The total value, from which we determine the slice proportions. If any of the
// provided values isn't a number, or is negative, we back out of creating the
// chart.
const total = computed(() => {
	if (!isNonEmptyArray(props.values)) {
		return 0;
	}

	if (!props.values.every(value => isNumber(value) && value >= 0)) {
		return 0;
	}

	return props.values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
});

// Determine our slices based on the provided values. If we couldn't determine a
// total, there's no need to generate slices.
const slices = computed(() => {
	if (total.value === 0) {
		return [];
	}

	// For each of our values, we generate a slice based on its value compared
	// to the total, and a rotation to place it in the correct place in the
	// chart. For the rotation, we convert the cumulative percentage into a
	// number of degrees of rotation (100 -> 360). We multiply by minus one
	// because CSS rotation acts clockwise, but degrees move anti-clockwise.
	let cumulativePercentage = 0;

	return props.values.map(value => {
		const slice = {
			commands: getDrawCommandsForValue(value),
			rotation: cumulativePercentage * 3.6,
			id: nanoid(),
		};

		cumulativePercentage += (value / total.value) * 100;

		return slice;
	});
});

/**
 * For a given value, retrieve the commands to draw a slice of the donut chart.
 *
 * @param  {number}  value
 *     The value for which to draw a slice.
 */
function getDrawCommandsForValue(value) {
	// Determine how much of the circle our value should take by converting the
	// percentage it represents into an angle.
	const angle = (value / total.value) * 360;
	// For slices that are greater than half of the circle, we need to ask the
	// arc to draw via the longest path, not the shortest path.
	const longPathFlag = angle > 180 ? 1 : 0;

	const commands = [];

	// Start by moving to the correct position to start drawing.
	commands.push(`M ${radius} 0`);

	// Draw an arc around our circle circumference to the end point, as defined
	// by our angle.
	commands.push(
		`A ${radius} ${radius} 0 ${longPathFlag} 1 ${getCircleCoordinateForAngle(angle, radius)}`,
	);

	// Draw a line back towards the centre, based on our donut size.
	commands.push(
		`L ${getCircleCoordinateForAngle(angle, innerRadius)}`,
	);

	// Arc back to the equivalent point in relation to our starting point.
	commands.push(
		`A ${innerRadius} ${innerRadius} 0 ${longPathFlag} 0 ${svgCentre} ${borderSize}`,
	);

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
	const coordinateX = radius * Math.sin(angle * Math.PI / 180) + 50;
	const coordinateY = -radius * Math.cos(angle * Math.PI / 180) + 50;

	return `${coordinateX} ${coordinateY}`;
}

/**
 * For a given slice index, retrieve the appropriate chart colour.
 *
 * @param  {numbers}  index
 *     The index of the chart slice.
 */
function getNextColour(index) {
	return chartColours[getNextIndex(index - 1, chartColours, { wrap: true })];
}
</script>
