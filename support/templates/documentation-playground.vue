<template>
	<component-playground v-bind="{ copy: template }" id="playground-{{COMPONENT_NAME}}" v-model="textSlots">
		<template #title>
			{{SENTENCE_CASE_NAME}}
		</template>

		<template #introduction>
			<p>...</p>
		</template>

		<{{COMPONENT_NAME}} v-bind="componentProps">
			{{ textSlots.label?.value }}

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>

			<template #help>
				{{ textSlots.help?.value }}
			</template>

			<template #error>
				{{ textSlots.error?.value }}
			</template>
		</{{COMPONENT_NAME}}>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Field label",
		value: "",
	},
	introduction: {
		label: "Introduction",
		value: "",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "",
		type: "textarea",
	},
	error: {
		label: "Error text",
		value: "",
		type: "textarea",
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

const { template } = useTemplateGenerator("form-field", textSlots, props);
</script>
