<template>
	<component-page>
		<template #title>
			Donut chart
		</template>

		<template #introduction>
			<p>Create a donut chart from a set of values. The chart will automatically determine the percentages for each of the figures based on the total.</p>
			<p>Note that when creating a chart, it is imperative to provide some kind of alternative for those who cannot see the chart.</p>
		</template>

		<component-props>
			<component-prop id="prop-values">
				<template #name>
					values
				</template>

				<template #type>
					Array
				</template>

				<template #default-value>
					null
				</template>

				<p>The values to display in the chart. If any values are not a number, or is negative, no chart will be generated.</p>
			</component-prop>

			<component-prop id="prop-colourful">
				<template #name>
					colourful
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to use the brighter set of chart colours. Use with caution, as depending on the number of slices, adjacent slices may not be sufficiently distinct.</p>
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
