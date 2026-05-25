<template>
	<li class="breadcrumb-item" data-test="breadcrumb-item">
		<span v-if="current" aria-current="page" class="flex items-center gap-2">
			<icon-chevron-right aria-hidden="true" class="breadcrumb-divider size-3" />

			<slot />
		</span>

		<a v-else v-bind="{ href }" class="flex items-center gap-2 text-current">
			<icon-chevron-right aria-hidden="true" class="breadcrumb-divider size-3" />

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

<style>
/**
 * Hide the divider for the first breadcrumb, without relying on knowledge of
 * the order of breadcrumbs in Javascript
 */
.breadcrumb-item:first-child .breadcrumb-divider {
	display: none;
}
</style>
