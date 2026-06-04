<template>
	<div data-test="{{ NAME | kebab }}">
		<slot />
	</div>
</template>

<script setup>
/**
 * [Describe what this component does.]
 */

import { ref } from "vue";

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
