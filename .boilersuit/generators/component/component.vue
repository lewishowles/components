<template>
	<div data-component="{{ NAME | kebab }}" data-test="{{ NAME | kebab }}">
		<slot />
	</div>
</template>

<script setup>
/**
 * [Describe what this component does.]
 */
defineProps({
	/**
	 * [Describe what this prop controls.]
	 */
	example: {
		type: String,
		default: null,
	},
});
</script>
