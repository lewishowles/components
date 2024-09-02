<template>
	<div class="flex items-center gap-2" aria-live="polite" data-test="loading-indicator">
		<icon-loading class="spin text-grey-500 dark:text-grey-400" />
		<slot />
	</div>
</template>

<script setup>
/**
 * `loading-indicator` provides a consistent loading notice and animation when
 * data is pending.
 */
</script>
