<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-field-button-group" v-model="textSlots">
		<template #title>
			Button group
		</template>

		<template #introduction>
			<p>A button group is a variant of radio group, designed for a more succinct choice between options.</p>
		</template>

		<form-field v-model="componentModel" v-bind="componentProps">
			{{ textSlots.default?.value }}

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>

			<template #help>
				{{ textSlots.help?.value }}
			</template>

			<template #error>
				{{ textSlots.error?.value }}
			</template>
		</form-field>
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
		label: "Field label",
		value: "Application theme",
	},
	introduction: {
		label: "Introduction",
		value: "Choose how you want to view the application.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "\"System\" will match your operating system or browser settings.",
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
		value: "button-group",
		type: "text",
	},
	options: {
		label: "Options",
		value: ["Light", "Dark", "System"],
		type: "select",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("form-field", { slots: textSlots, props });
</script>
