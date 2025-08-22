<template>
	<component-page>
		<template #title>
			Skeleton loader
		</template>

		<template #introduction>
			<p><code>skeleton-loader</code> is used to build a skeleton loading indicator. Comprising one or more <code>skeleton-indicator</code> components, this wrapper provides an accessible label.</p>
		</template>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The content of the skeleton loader, primarily composed of <code>skeleton-indicator</code> components.</p>
			</component-slot>

			<component-slot id="slot-label">
				<template #name>
					label
				</template>

				<p>The accessible label to describe this loader.</p>
				<p><em>Note that no default text is provided by design. Using a specific message related to what is loaded is strongly encouraged.</em></p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-skeleton-loader />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundSkeletonLoader from "./fragments/playground-skeleton-loader.vue";
</script>
