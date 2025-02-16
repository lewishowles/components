<template>
	<h3 class="preview-label relative mb-3 text-sm text-grey-500 dark:text-white/60">
		<div class="absolute inset-y-0 end-full me-4 w-1 rounded-sm bg-grey-300" />

		<slot />
	</h3>
</template>

<style>
.preview-label:not(:first-child) {
	margin-top: calc(var(--spacing) * 6);
}
</style>
