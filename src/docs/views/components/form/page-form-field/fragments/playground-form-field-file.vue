<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-field-file"
		v-model="textSlots"
	>
		<template #title>File</template>

		<template #introduction>
			<p>Allow the user to upload one or more files.</p>
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
		value: "Supporting document",
	},
	introduction: {
		label: "Introduction",
		value: "",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "PDF files only, up to 5MB.",
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
		value: "file",
		type: "text",
	},
	multiple: {
		label: "Multiple",
		value: false,
		type: "boolean",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("form-field", { slots: textSlots, props });
</script>
