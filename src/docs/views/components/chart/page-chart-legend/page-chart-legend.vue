<template>
	<component-page>
		<template #title>Chart legend</template>

		<template #introduction>
			<p>
				Display a colour-keyed legend for a chart. Designed to work alongside
				<code>useChartConfig</code>
				, which extends raw segments with the library's accessible chart palette and provides the
				<code>series</code>
				value this component expects.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-series">
				<template #name>series</template>

				<template #type>Array</template>

				<template #default-value>[]</template>

				<p>
					The series to display. Each entry should have
					<code>label</code>
					,
					<code>value</code>
					, and
					<code>color</code>
					properties. Typically produced by
					<code>useChartConfig</code>
					.
				</p>
			</component-prop>

			<component-prop id="prop-show-values">
				<template #name>showValues</template>

				<template #type>Boolean</template>

				<template #default-value>true</template>

				<p>Whether to show the value alongside each label.</p>
			</component-prop>

			<component-prop id="prop-format-value">
				<template #name>formatValue</template>

				<template #type>Function</template>

				<p>
					A callback to format each value for display. Receives the raw value and returns a string.
					Falls back to the raw value when not provided.
				</p>
			</component-prop>

			<component-prop id="prop-orientation">
				<template #name>orientation</template>

				<template #type>String</template>

				<template #default-value>"horizontal"</template>

				<p>
					The layout direction of the legend entries.
					<code>"horizontal"</code>
					wraps entries in a row;
					<code>"vertical"</code>
					stacks them in a column.
				</p>
			</component-prop>
		</component-props>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="chart-legend"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-chart-legend />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundChartLegend from "./fragments/playground-chart-legend.vue";
</script>
