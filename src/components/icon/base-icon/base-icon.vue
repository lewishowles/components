<template>
	<svg
		v-bind="{ viewBox }"
		fill-rule="evenodd"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="1.5"
		aria-hidden="true"
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
