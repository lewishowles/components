<template>
	<!-- Inactive screen content is unmounted so its fields leave the flow. -->
	<div v-if="isVisible" data-component="form-screen" data-test="form-screen" :data-screen-id="id">
		<slot />
	</div>
</template>

<script setup>
import { computed, inject, onUnmounted } from "vue";
import { isFunction } from "@lewishowles/helpers/general";

const props = defineProps({
	/**
	 * A unique identifier used to register this screen to the active
	 * `form-flow`.
	 */
	id: {
		type: String,
		required: true,
	},
});

// Data provided by the parent `form-flow`.
const formFlow = inject("form-flow", {});

// Show this screen when its flow marks it current. Screens without a flow are
// visible by default.
const isVisible = computed(() => {
	if (!isFunction(formFlow.isCurrentScreen)) {
		return true;
	}

	return formFlow.isCurrentScreen(props.id);
});

// Register the screen with the flow.
formFlow.registerScreen?.(props.id);

// Unregister the screen when its owner removes it.
onUnmounted(() => {
	formFlow.unregisterScreen?.(props.id);
});
</script>
