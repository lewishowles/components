<template>
	<component-page>
		<template #title> Donut chart </template>

		<template #introduction>
			<p>
				Create a donut chart from a set of values. The chart automatically determines proportions
				based on the total. A <code>label</code> slot is required; use the <code>description</code>
				slot for additional context about the chart's findings.
			</p>
		</template>

		<component-slots>
			<component-slot id="slot-label">
				<template #name> label </template>

				<p>A label describing the chart as a whole. Required.</p>
			</component-slot>

			<component-slot id="slot-description">
				<template #name> description </template>

				<p>
					Additional context about the chart's findings. Use this to describe trends rather than
					repeating the label.
				</p>
			</component-slot>
		</component-slots>

		<component-props>
			<component-prop id="prop-values" required>
				<template #name> values </template>

				<template #type> Array </template>

				<p>
					The values to display. If any value is not a number, or is negative, no chart will be
					generated.
				</p>
			</component-prop>

			<component-prop id="prop-colourful">
				<template #name> colourful </template>

				<template #type> Boolean </template>

				<template #default-value> false </template>

				<p>
					Whether to use the brighter set of chart colours. Use with caution; adjacent slices may
					not be sufficiently distinct depending on the number of segments.
				</p>
			</component-prop>
		</component-props>

		<component-playgrounds>
			<playground-donut-chart />
			<playground-donut-chart-colourful />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundDonutChart from "./fragments/playground-donut-chart.vue";
import PlaygroundDonutChartColourful from "./fragments/playground-donut-chart-colourful.vue";
</script>
