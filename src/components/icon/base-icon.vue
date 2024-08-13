<template>
	<svg xmlns="http://www.w3.org/2000/svg" role="img" v-bind="{ viewBox }">
		<slot />
	</svg>
</template>

<script setup>
defineProps({
	/**
	 * The viewbox for the icon.
	 */
	viewBox: {
		type: String,
		default: "0 0 18 18",
	},
});
</script>
