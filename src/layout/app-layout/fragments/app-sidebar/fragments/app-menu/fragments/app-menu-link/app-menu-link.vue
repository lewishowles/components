<template>
	<li :class="{ relative: isActiveRoute }">
		<div
			v-if="isActiveRoute"
			class="absolute inset-y-0 start-0 -ms-8 w-1 rounded bg-purple-800 dark:bg-purple-300"
		/>

		<router-link
			v-bind="{ to }"
			class="hocus:underline block py-1 font-mono no-underline"
			:class="{
				'text-purple-800 dark:text-purple-300': isActiveRoute,
				'text-current': !isActiveRoute,
			}"
		>
			<slot />
		</router-link>
	</li>
</template>

<script setup>
import { computed, inject, useSlots } from "vue";
import { getSlotText } from "@lewishowles/helpers/vue";
import { useRoute } from "vue-router";
import useMenu from "@/docs/composables/use-menu/use-menu";

const props = defineProps({
	/**
	 * The destination page, utilising router-link's `to` property.
	 */
	to: {
		type: String,
		default: "",
	},
});

const { sectionTitle } = inject("app-menu-section", {});
const { registerMenuItem } = useMenu();

const route = useRoute();
const slots = useSlots();
// Whether the route that this menu link represents is the current page.
const isActiveRoute = computed(() => props.to === route.path);
// The default (label) text for this link.
const labelText = computed(() => getSlotText(slots.default));

registerMenuItem({ section: sectionTitle, label: labelText, to: props.to });
</script>
