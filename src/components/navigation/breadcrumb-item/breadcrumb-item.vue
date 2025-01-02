<template>
	<li class="breadcrumb-item" data-test="breadcrumb-item">
		<a v-bind="{ href }" class="flex items-center gap-2 text-current">
			<icon-chevron-right class="breadcrumb-divider size-3" />

			<slot />
		</a>
	</li>
</template>

<script setup>
defineProps({
	/**
	 * The link for this item.
	 */
	href: {
		type: String,
		required: true,
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
