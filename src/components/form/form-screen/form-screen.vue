<template>
	<!-- Inactive screen content is unmounted so its fields leave the flow. -->
	<div v-if="isVisible" data-component="form-screen" data-test="form-screen" :data-screen-id="id">
		<h2 v-if="haveTitle" data-part="title" data-test="form-screen-title">
			<slot name="title" />
		</h2>

		<slot />
	</div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, useSlots } from "vue";
import { isFunction } from "@lewishowles/helpers/general";
import { getSlotText, isNonEmptySlot } from "@lewishowles/helpers/vue";

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
const slots = useSlots();
// Whether this screen provides a visible title.
const haveTitle = computed(() => isNonEmptySlot(slots.title));

// The concise label used by the flow's default progress display.
const progressLabel = computed(() => {
	const labelSlot = isNonEmptySlot(slots["progress-label"]) ? slots["progress-label"] : slots.title;

	return getSlotText(labelSlot);
});

// Show this screen when its flow marks it current. Screens without a flow are
// visible by default.
const isVisible = computed(() => {
	if (!isFunction(formFlow.isCurrentScreen)) {
		return true;
	}

	return formFlow.isCurrentScreen(props.id);
});

// Register the screen with the flow.
formFlow.registerScreen?.({ id: props.id, progressLabel });

onMounted(() => {
	if (import.meta.env.DEV && !haveTitle.value) {
		console.warn("[form-screen] No accessible title found. Provide a `title` slot.");
	}
});

// Unregister the screen when its owner removes it.
onUnmounted(() => {
	formFlow.unregisterScreen?.(props.id);
});
</script>
