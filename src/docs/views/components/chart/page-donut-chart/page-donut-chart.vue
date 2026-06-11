<template>
	<component-page>
		<template #title>Donut chart</template>

		<template #introduction>
			<p>
				Create a donut chart from a set of values. The chart automatically determines proportions
				based on the total. A
				<code>label</code>
				slot is required; use the
				<code>description</code>
				slot for additional context about the chart's findings.
			</p>

			<p>
				Use
				<code>segments</code>
				(with
				<code>useChartConfig</code>
				) to label each slice in the accessible table. Pass
				<code>values</code>
				for backwards-compatible usage when labels aren't needed.
			</p>
		</template>

		<component-slots>
			<component-slot id="slot-label">
				<template #name>label</template>

				<p>A label describing the chart as a whole. Required.</p>
			</component-slot>

			<component-slot id="slot-description">
				<template #name>description</template>

				<p>
					Additional context about the chart's findings. Use this to describe trends rather than
					repeating the label.
				</p>
			</component-slot>
		</component-slots>

		<component-props>
			<component-prop id="prop-segments">
				<template #name>segments</template>

				<template #type>Array</template>

				<template #default-value>[]</template>

				<p>
					The segments to display, each with a
					<code>label</code>
					and
					<code>value</code>
					. Proportions are determined automatically. Preferred over
					<code>values</code>
					as it enables labelled rows in the accessible table. Works well with
					<code>useChartConfig</code>
					.
				</p>
			</component-prop>

			<component-prop id="prop-values">
				<template #name>values</template>

				<template #type>Array</template>

				<template #default-value>[]</template>

				<p>
					The values to display. If any value is not a number, or is negative, no chart will be
					generated. Kept for backwards compatibility — prefer
					<code>segments</code>
					for new usage.
				</p>
			</component-prop>
		</component-props>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="donut-chart"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-donut-chart />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundDonutChart from "./fragments/playground-donut-chart.vue";
</script>
