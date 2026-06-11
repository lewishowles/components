<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-trigger-reactive-state"
		v-model="textSlots"
	>
		<template #title>{{ snippetVariant.label }}</template>

		<template #introduction>
			<p>{{ snippetVariant.description }}</p>
		</template>

		<div class="flex flex-wrap gap-8">
			<ui-button v-bind="componentProps" ref="button">
				{{ textSlots.default?.value }}
			</ui-button>

			<ui-button class="button--muted" @click="triggerReactiveState">
				Trigger reactive state
			</ui-button>
		</div>
	</component-playground>
</template>

<script setup>
import { useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import { uiButtonMetadata } from "@/components/interaction/ui-button/ui-button.metadata.js";

import { useComponentPlayground } from "@/docs/views/components/composables/use-component-playground/use-component-playground";

// Our reactive button.
const buttonElement = useTemplateRef("button");

const { componentProps, snippetVariant, template, textSlots } = useComponentPlayground(
	uiButtonMetadata,
	"trigger-reactive-state",
);

/**
 * Trigger the reactive state on our button.
 */
function triggerReactiveState() {
	runComponentMethod(buttonElement.value, "react");
}
</script>
