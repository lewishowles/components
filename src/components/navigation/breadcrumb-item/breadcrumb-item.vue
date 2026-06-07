<template>
	<li
		class="group flex items-center gap-2"
		data-component="breadcrumb-item"
		:data-current="current || null"
		data-test="breadcrumb-item"
	>
		<icon-chevron-right aria-hidden="true" class="size-3 group-first:hidden" />

		<span v-if="current" aria-current="page">
			<slot />
		</span>

		<slot v-else name="link">
			<a v-bind="{ href }" class="text-current">
				<slot />
			</a>
		</slot>
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
