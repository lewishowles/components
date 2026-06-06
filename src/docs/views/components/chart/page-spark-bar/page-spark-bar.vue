<template>
	<component-page>
		<template #title>Spark bar</template>

		<template #introduction>
			<p>
				Display a metric within a range using a compact horizontal bar. Progress is calculated as a
				percentage based on current, min, and max values.
			</p>
		</template>

		<component-props>
			<component-prop id="prop-current">
				<template #name>current</template>

				<template #type>number</template>

				<template #default-value>0</template>

				<p>The current value represented by the spark bar.</p>
			</component-prop>

			<component-prop id="prop-min">
				<template #name>min</template>

				<template #type>number</template>

				<template #default-value>0</template>

				<p>The minimum value, used to determine bar fill.</p>
			</component-prop>

			<component-prop id="prop-max">
				<template #name>max</template>

				<template #type>number</template>

				<template #default-value>100</template>

				<p>The maximum value, used to determine bar fill.</p>
			</component-prop>

			<component-prop id="prop-track-classes">
				<template #name>trackClasses</template>

				<template #type>Vue class binding</template>

				<template #default-value>h-1 rounded-full bg-grey-200 dark:bg-white/20</template>

				<p>
					Additional classes to apply to the track, merged on top of the base styles.
					<code>grow</code>
					is always applied to ensure the track fills available space. Classes provided will
					override default classes.
				</p>
			</component-prop>

			<component-prop id="prop-bar-classes">
				<template #name>barClasses</template>

				<template #type>Vue class binding</template>

				<template #default-value>h-full rounded-full bg-primary</template>

				<p>
					Additional classes to apply to the bar, merged on top of the base styles.
					<code>transition-all ease-out</code>
					is always applied. Classes provided will override default classes.
				</p>
			</component-prop>

			<component-prop id="prop-value-classes">
				<template #name>valueClasses</template>

				<template #type>Vue class binding</template>

				<template #default-value>text-xs font-medium</template>

				<p>Classes to apply to the value display.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>default</template>

				<p>
					Provide custom content alongside the bar. Receives metric values and calculated
					percentage.
				</p>

				<table>
					<thead>
						<tr>
							<th>Slot prop</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>current</code></td>
							<td><code>number</code></td>
							<td>The current value.</td>
						</tr>
						<tr>
							<td><code>min</code></td>
							<td><code>number</code></td>
							<td>The minimum value.</td>
						</tr>
						<tr>
							<td><code>max</code></td>
							<td><code>number</code></td>
							<td>The maximum value.</td>
						</tr>
						<tr>
							<td><code>percentage</code></td>
							<td><code>number</code></td>
							<td>The calculated percentage (0–100).</td>
						</tr>
					</tbody>
				</table>
			</component-slot>
		</component-slots>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="spark-bar"</template>
				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-track">
				<template #attribute>data-part="track"</template>
				<p>The track element — the background behind the filled bar.</p>
			</component-styling-hook>

			<component-styling-hook id="hook-data-part-bar">
				<template #attribute>data-part="bar"</template>
				<p>The filled bar indicating the current value.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-spark-bar />
			<playground-spark-bar-with-content />
			<playground-spark-bar-custom-range />
			<playground-spark-bar-custom-design />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundSparkBar from "./fragments/playground-spark-bar.vue";
import PlaygroundSparkBarCustomDesign from "./fragments/playground-spark-bar-custom-design.vue";
import PlaygroundSparkBarCustomRange from "./fragments/playground-spark-bar-custom-range.vue";
import PlaygroundSparkBarWithContent from "./fragments/playground-spark-bar-with-content.vue";
</script>
