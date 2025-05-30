<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-{{COMPONENT_NAME}}" v-model="textSlots">
		<template #title>
			{{SENTENCE_CASE_NAME}}
		</template>

		<template #introduction>
			<p>...</p>
		</template>

		<{{COMPONENT_NAME}} v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}
		</{{COMPONENT_NAME}}>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "",
		value: "",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	type: {
		label: "Type",
		value: "select",
		type: "text",
	},
	options: {
		label: "Options",
		value: ["Chocolate", "Banana", "Vanilla", "Strawberry"],
		type: "select",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("{{COMPONENT_NAME}}", { slots: textSlots, props });
</script>
