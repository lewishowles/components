<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-reactive"
		v-model="textSlots"
	>
		<template #title>Triggering reactive state</template>

		<template #introduction>
			<p>
				When a button is reactive, its reactive state can be triggered using the exposed
				<code>react</code>
				method.
			</p>
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
import { useUiButtonPlayground } from "@/docs/views/components/interaction/page-ui-button/composables/use-ui-button-playground";

const { componentProps, template, textSlots } = useUiButtonPlayground("trigger-reactive-state");

// Our reactive button
const buttonElement = useTemplateRef("button");

/**
 * Trigger the reactive state on our button.
 */
function triggerReactiveState() {
	runComponentMethod(buttonElement.value, "react");
}
</script>
