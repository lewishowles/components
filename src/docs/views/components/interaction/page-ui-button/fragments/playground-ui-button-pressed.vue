<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-pressed"
		v-model="textSlots"
	>
		<template #title>Toggle button</template>

		<template #introduction>
			<p>
				Toggle buttons have two stable states — pressed and unpressed. The
				<code>pressed</code>
				prop adds
				<code>aria-pressed</code>
				so screen readers announce the current state without needing a label change. Click the
				button below to toggle it.
			</p>
		</template>

		<ui-button v-bind="{ ...componentProps, pressed: isPressed }" @click="isPressed = !isPressed">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import { useUiButtonPlayground } from "@/docs/views/components/interaction/page-ui-button/composables/use-ui-button-playground";

// Whether the toggle button is currently pressed.
const isPressed = ref(false);

const { componentProps, template, textSlots } = useUiButtonPlayground("toggle");
</script>
