<template>
	<component-playground v-bind="{ copy: template }" id="playground-ui-button-reactive" v-model="textSlots">
		<template #title>
			Triggering reactive state
		</template>

		<template #introduction>
			<p>When a button is reactive, its reactive state can be triggered using the exposed <code>react</code> method.</p>
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
import { computed, ref, useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Button label",
		value: "Create account",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	reactive: {
		label: "Reactive",
		value: true,
		type: "boolean",
	},
	class: {
		label: "Button classes",
		value: "button--primary",
		isInline: true,
	},
});

// Events to use in the template.
const events = ref({
	click: {
		label: "Click handler",
		value: "createAccount",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("ui-button", { slots: textSlots, props, events });

// Our reactive button
const buttonElement = useTemplateRef("button");

/**
 * Trigger the reactive state on our button.
 */
function triggerReactiveState() {
	runComponentMethod(buttonElement.value, "react");
}
</script>
