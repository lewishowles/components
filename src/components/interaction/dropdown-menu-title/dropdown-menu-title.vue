<template>
	<component :is="headingLevel" class="text-grey-950 my-2 px-4 font-semibold">
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
