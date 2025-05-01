<template>
	<li>
		<router-link v-bind="{ to: { name } }" class="text-current no-underline hocus:underline py-1 block">
			<slot />
		</router-link>
	</li>
</template>

<script setup>
defineProps({
	/**
	 * The destination page name, utilising router-link's `to` property.
	 */
	name: {
		type: String,
		default: null,
	},
});
</script>
