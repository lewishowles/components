<template>
	<component-page>
		<template #title>
			Loading indicator
		</template>

		<template #introduction>
			<p><code>loading-indicator</code> provides a consistent loading notice and animation when data is pending.</p>
		</template>

		<component-props>
			<component-prop id="prop-large">
				<template #name>
					large
				</template>

				<template #type>
					Boolean
				</template>

				<template #default-value>
					false
				</template>

				<p>Whether to display a larger, vertical version of the indicator.</p>
			</component-prop>
		</component-props>

		<component-slots>
			<component-slot id="slot-default">
				<template #name>
					default
				</template>

				<p>The default slot contains the text to display beside the loading indicator.</p>
				<p><em>Note that no default text is provided because it is recommended to be clear about what is happening, and what is loading, instead of using a generic message.</em></p>
			</component-slot>
		</component-slots>

		<component-playgrounds>
			<playground-loading-indicator />
			<playground-loading-indicator-large />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundLoadingIndicator from "./fragments/playground-loading-indicator.vue";
import PlaygroundLoadingIndicatorLarge from "./fragments/playground-loading-indicator-large.vue";
</script>
