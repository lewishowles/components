<template>
	<li
		class="group"
		data-component="breadcrumb-item"
		:data-current="current || null"
		data-test="breadcrumb-item"
	>
		<span v-if="current" aria-current="page" class="flex items-center gap-2">
			<icon-chevron-right aria-hidden="true" class="size-3 group-first:hidden" />

			<slot />
		</span>

		<a v-else v-bind="{ href }" class="flex items-center gap-2 text-current">
			<icon-chevron-right aria-hidden="true" class="size-3 group-first:hidden" />

			<slot />
		</a>
	</li>
</template>

<script setup>
defineProps({
	/**
	 * The link for this item. Required when `current` is false.
	 */
	href: {
		type: String,
		default: undefined,
	},

	/**
	 * Whether this item represents the current page. When true, renders as a
	 * non-interactive span with `aria-current="page"` rather than a link.
	 */
	current: {
		type: Boolean,
		default: false,
	},
});
</script>
