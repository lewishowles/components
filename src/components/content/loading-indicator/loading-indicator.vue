<template>
	<div
		class="flex items-center gap-2"
		v-bind="{ class: { 'flex-col': large }, 'data-large': large || null }"
		role="status"
		aria-live="polite"
		data-component="loading-indicator"
		data-test="loading-indicator"
	>
		<loading-spinner :class="{ 'size-7': large }" />

		<slot />
	</div>
</template>

<script setup>
/**
 * `loading-indicator` provides a consistent loading notice and animation when
 * data is pending.
 */

defineProps({
	/**
	 * Whether to display a larger version of the loading indicator.
	 */
	large: {
		type: Boolean,
		default: false,
	},
});
</script>
