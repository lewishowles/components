<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		v-bind="{ viewBox }"
		fill-rule="evenodd"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="1.5"
		role="presentation"
	>
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
