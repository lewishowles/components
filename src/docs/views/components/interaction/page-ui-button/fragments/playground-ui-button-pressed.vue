<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-pressed"
		v-model="textSlots"
	>
		<template #title> Toggle button </template>

		<template #introduction>
			<p>
				Toggle buttons have two stable states — pressed and unpressed. The <code>pressed</code> prop
				adds <code>aria-pressed</code> so screen readers announce the current state without needing
				a label change. Click the button below to toggle it.
			</p>
		</template>

		<ui-button v-bind="{ ...componentProps, pressed: isPressed }" @click="isPressed = !isPressed">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Whether the toggle button is currently pressed.
const isPressed = ref(false);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Button label",
		value: "Mute",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	class: {
		label: "Button classes",
		value: "button--toggle",
		isInline: true,
	},
});

// Events to use in the template.
const events = ref({
	click: {
		label: "Click handler",
		value: "toggleMute",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("ui-button", { slots: textSlots, props, events });
</script>
