<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-pressed"
		v-model="textSlots"
	>
		<template #title>{{ snippetVariant.label }}</template>

		<template #introduction>
			<p>{{ snippetVariant.description }}</p>
		</template>

		<ui-button v-bind="{ ...componentProps, pressed: isPressed }" @click="isPressed = !isPressed">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import { uiButtonMetadata } from "@/components/interaction/ui-button/ui-button.metadata.js";

import { useComponentPlayground } from "@/docs/views/components/composables/use-component-playground/use-component-playground";

// Whether the toggle button is currently pressed.
const isPressed = ref(false);

const { componentProps, snippetVariant, template, textSlots } = useComponentPlayground(
	uiButtonMetadata,
	"toggle",
);
</script>
