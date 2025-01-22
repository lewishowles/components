<template>
	<ui-button
		class="w-full border-s-2 px-4 py-2 hocus:border-current hocus:bg-grey-50 hocus:text-purple-800 dark:hocus:bg-white/10 dark:hocus:text-purple-300"
		:class="{
			'border-current bg-grey-50 text-purple-800 dark:bg-white/10 dark:text-purple-300': selected,
			'border-transparent': !selected,
		}"
	>
		<slot />
	</ui-button>
</template>

<script setup>
defineProps({
	/**
	 * Whether this menu button should show a selected state.
	 */
	selected: {
		type: Boolean,
		default: false,
	},
});
</script>
