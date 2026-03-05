<template>
	<component-page>
		<template #title>
			Loading skeleton
		</template>

		<template #introduction>
			<p><code>loading-skeleton</code> is used to build a skeleton loading indicator. Comprising one or more <code>loading-skeleton-indicator</code> components, this wrapper provides an accessible label.</p>
		</template>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The content of the loading skeleton, primarily composed of <code>loading-skeleton-indicator</code> components.</p>
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
			<playground-loading-skeleton />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundLoadingSkeleton from "./fragments/playground-loading-skeleton.vue";
</script>
