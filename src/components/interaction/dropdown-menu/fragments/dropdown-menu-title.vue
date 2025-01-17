<template>
	<component :is="headingLevel" class="my-2 px-4 font-semibold text-grey-950">
		<slot />
	</component>
</template>

<script setup>
defineProps({
	/**
	 * The heading level to use for the dropdown menu title.
	 */
	headingLevel: {
		type: String,
		default: "h4",
	},
});
</script>
