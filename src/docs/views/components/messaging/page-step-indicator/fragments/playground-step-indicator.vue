<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-step-indicator" v-model="textSlots">
		<template #title>
			Step indicator
		</template>

		<step-indicator v-bind="componentProps">
			{{ textSlots.default?.value }}
		</step-indicator>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Label",
		value: "Address details",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	currentStep: {
		label: "Current step",
		value: 3,
		type: "number",
	},
	stepCount: {
		label: "Step count",
		value: 5,
		type: "number",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("step-indicator", { slots: textSlots, props });
</script>
