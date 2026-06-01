<template>
	<component-tab-section v-bind="{ id }">
		<template #title>
			<slot name="attribute" />
		</template>

		<slot />
	</component-tab-section>
</template>

<script setup>
import ComponentTabSection from "../component-tab-section/component-tab-section.vue";

defineProps({
	/**
	 * The ID of this section, allowing it to be linked to.
	 */
	id: {
		type: String,
		default: null,
	},
});
</script>
