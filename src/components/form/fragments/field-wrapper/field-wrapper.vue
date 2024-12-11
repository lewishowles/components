<template>
	<div class="flex flex-col gap-1" :class="{ 'relative ps-5': haveError }" data-test="field-wrapper">
		<div :class="{ 'absolute inset-y-0 start-0 w-1 rounded-full bg-red-600 dark:bg-red-300': haveError }" />

		<slot />
	</div>
</template>

<script setup>
defineProps({
	/**
	 * Whether this field has an error, allowing us to style the wrapper
	 * appropriately.
	 */
	haveError: {
		type: Boolean,
		default: false,
	},
});
</script>
