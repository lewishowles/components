<template>
	<link-tag
		class="w-full border-s-2 px-4 py-2 hocus:border-current hocus:bg-grey-50 dark:hocus:bg-white/10"
		:class="{
			'border-current bg-grey-50 dark:bg-white/10': selected,
			'border-transparent': !selected,
		}"
	>
		<slot />
	</link-tag>
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
