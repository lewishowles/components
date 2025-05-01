<template>
	<div class="flex gap-4 items-baseline relative group/prop-title">
		<a :href="`#${id}`" class="opacity-0 absolute top-8.5 end-full pe-3 block group-hover/prop-title:opacity-100 transition-opacity">
			# <span class="sr-only">Link to this section</span>
		</a>

		<h3>
			<slot name="title" />
		</h3>

		<dl class="flex gap-4 not-prose text-sm">
			<div class="rounded-full bg-grey-100 flex items-center gap-2 px-3 py-1">
				<dt class="font-bold">
					Type
				</dt>
				<dd class="text-grey-500">
					<slot name="type" />
				</dd>
			</div>
			<div class="rounded-full bg-grey-100 flex items-center gap-2 px-3 py-1">
				<dt class="font-bold">
					Default
				</dt>
				<dd class="text-grey-500 font-mono">
					<slot name="default" />
				</dd>
			</div>
		</dl>

		<a href="#content" class="text-sm opacity-0 group-hover/prop-title:opacity-100 transition-opacity">&uarr; Top</a>
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
