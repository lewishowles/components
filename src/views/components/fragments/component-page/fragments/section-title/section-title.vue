<template>
	<div v-bind="{ id }" class="flex gap-4 items-baseline relative group/prop-title">
		<a v-bind="{ href: `#${id}` }" class="opacity-0 absolute top-8.5 end-full pe-3 block group-hover/prop-title:opacity-100 transition-opacity">
			# <span class="sr-only">Link to this section</span>
		</a>

		<h3>
			<slot name="title" />
		</h3>

		<slot name="post-title" />
	</div>
</template>

<script setup>
defineProps({
	/**
	 * The ID of this section, allow it to be linked to.
	 */
	id: {
		type: String,
		default: null,
	},
});
</script>
