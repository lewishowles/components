<template>
	<div class="flex items-center gap-2" :class="{ 'flex-col': large }" aria-live="polite" data-test="loading-indicator">
		<icon-loading class="spin text-grey-500 dark:text-grey-400" :class="{ 'size-7': large }" />
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
