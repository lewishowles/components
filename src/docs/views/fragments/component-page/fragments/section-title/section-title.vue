<template>
	<div v-bind="{ id }" class="group/prop-title relative flex items-baseline gap-4">
		<a
			v-bind="{ href: `#${id}` }"
			class="absolute inset-e-full top-8.5 block pe-3 opacity-0 transition-opacity group-hover/prop-title:opacity-100 focus:opacity-100"
		>
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
