<template>
	<li>
		<router-link v-bind="{ to }" class="font-mono text-grey-700 no-underline hocus:underline py-1 block">
			<slot />
		</router-link>
	</li>
</template>

<script setup>
defineProps({
	/**
	 * The destination page, utilising router-link's `to` property.
	 */
	to: {
		type: String,
		default: null,
	},
});
</script>
