<template>
	<component :is="tag" class="mb-6 text-2xl font-bold text-grey-950 dark:text-grey-50" data-test="modal-dialog-title">
		<slot />
	</component>
</template>

<script setup>
defineProps({
	/**
	 * The tag to use for this title.
	 */
	tag: {
		type: String,
		default: "h2",
	},
});
</script>
