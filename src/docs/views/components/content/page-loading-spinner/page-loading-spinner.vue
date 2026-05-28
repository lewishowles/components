<template>
	<component-page>
		<template #title> Loading spinner </template>

		<template #introduction>
			<p>
				<code>loading-spinner</code> provides a standardised, spinning loading icon, primarily used
				in <code>loading-indicator</code>.
			</p>
		</template>

		<component-styling-hooks>
			<component-styling-hook id="hook-data-component">
				<template #attribute>data-component="loading-spinner"</template>

				<p>Present on the root element. Use to scope styles to this component.</p>
			</component-styling-hook>
		</component-styling-hooks>

		<component-playgrounds>
			<playground-loading-spinner />
		</component-playgrounds>
	</component-page>
</template>

<script setup>
import PlaygroundLoadingSpinner from "./fragments/playground-loading-spinner.vue";
</script>
