<template>
	<li :class="{ 'relative': isActiveRoute }">
		<div v-if="isActiveRoute" class="w-1 rounded bg-purple-800 dark:bg-purple-300 absolute start-0 -ms-8 inset-y-0" />

		<router-link v-bind="{ to }" class="font-mono no-underline hocus:underline py-1 block" :class="{ 'text-purple-800 dark:text-purple-300': isActiveRoute, 'text-current': !isActiveRoute }">
			<slot />
		</router-link>
	</li>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
	/**
	 * The destination page, utilising router-link's `to` property.
	 */
	to: {
		type: String,
		default: null,
	},
});

const route = useRoute();
// Whether the route that this menu link represents is the current page.
const isActiveRoute = computed(() => props.to === route.path);
</script>
