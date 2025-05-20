<template>
	<component :is="tag" class="flex flex-col gap-1" :class="{ 'relative ps-5': haveError }" data-test="field-wrapper">
		<div v-if="haveError" class="absolute inset-y-0 start-0 w-1 rounded-full bg-red-600 dark:bg-red-300" />

		<slot />
	</component>
</template>

<script setup>
defineProps({
	/**
	 * The tag to use for the wrapper, most useful when a fieldset is required,
	 * such as a date field.
	 */
	tag: {
		type: String,
		default: "div",
	},

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
