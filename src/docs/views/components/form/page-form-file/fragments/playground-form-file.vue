<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-file"
		v-model="textSlots"
	>
		<template #title>Form file</template>

		<form-file v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}

			<template #help>
				{{ textSlots.help?.value }}
			</template>

			<template #error>
				{{ textSlots.error?.value }}
			</template>
		</form-file>
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
	multiple: {
		label: "Multiple",
		value: true,
		type: "boolean",
	},
	required: {
		label: "Required",
		value: true,
		type: "boolean",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("form-file", { slots: textSlots, props });
</script>
