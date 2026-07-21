<template>
	<component
		:is="tag"
		class="flex flex-col gap-1"
		:data-state="haveError ? 'invalid' : undefined"
		data-part="field"
		data-test="field-wrapper"
	>
		<div v-if="haveError" data-part="error-marker" />

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
