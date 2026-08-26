<template>
	<!-- Inactive screen content is unmounted so its fields leave the flow. -->
	<div
		v-if="isVisible"
		ref="screen-element"
		data-component="form-screen"
		data-test="form-screen"
		:data-screen-id="id"
	>
		<h2
			v-if="haveTitle"
			class="text-content-strong text-2xl font-bold"
			:class="{ 'mbe-4 lg:mbe-6': !haveIntroduction }"
			tabindex="-1"
			data-part="title"
			data-test="form-screen-title"
		>
			<slot name="title" />
		</h2>

		<p v-if="haveIntroduction" class="mbe-4 lg:mbe-6" data-part="introduction">
			<slot name="introduction" />
		</p>

		<form-layout v-bind="{ class: layoutClasses }">
			<slot />
		</form-layout>
	</div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, useSlots, useTemplateRef } from "vue";
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

	/**
	 * If a field name is provided, the screen automatically advances when that
	 * field's value changes and successfully validates. Initial model data and
	 * programmatic updates do not trigger this progression.
	 */
	autoAdvance: {
		type: String,
		default: undefined,
	},

	/**
	 * If a field name is provided, that field is focused when the screen
	 * becomes active. The error summary receives focus first if it is showing.
	 * Otherwise, the named field receives focus if it is registered. If not,
	 * the screen title receives focus.
	 */
	autoFocus: {
		type: String,
		default: undefined,
	},
});

// Data provided by the parent `form-flow`.
const { isCurrentScreen, layoutClasses, registerScreen, unregisterScreen } = inject(
	"form-flow",
	{},
);

const slots = useSlots();
// The visible screen root, supplied to the flow for heading fallback focus.
const screenElement = useTemplateRef("screen-element");
// Whether this screen provides a visible title.
const haveTitle = computed(() => isNonEmptySlot(slots.title));
// Whether this screen provides introductory content below its title.
const haveIntroduction = computed(() => isNonEmptySlot(slots.introduction));

// The concise label used by the flow's default progress display.
const progressLabel = computed(() => {
	const labelSlot = isNonEmptySlot(slots["progress-label"]) ? slots["progress-label"] : slots.title;

	return getSlotText(labelSlot);
});

// Show this screen when its flow marks it current. Screens without a flow are
// visible by default.
const isVisible = computed(() => {
	if (!isFunction(isCurrentScreen)) {
		return true;
	}

	return isCurrentScreen(props.id);
});

// Register the screen with the flow.
registerScreen?.({
	id: props.id,
	progressLabel,
	autoAdvance: props.autoAdvance,
	autoFocus: props.autoFocus,
	// Share the root ref so form-flow can find the title after the screen renders.
	element: screenElement,
});

onMounted(() => {
	if (import.meta.env.DEV && !haveTitle.value) {
		console.warn("[form-screen] No accessible title found. Provide a `title` slot.");
	}
});

// Unregister the screen when its owner removes it.
onUnmounted(() => {
	unregisterScreen?.(props.id);
});
</script>
