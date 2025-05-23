<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-field-select" v-model="textSlots">
		<template #title>
			Select
		</template>

		<template #introduction>
			<p>Allow a user to select one option from a list of possible options. When wanting to use a select, consider whether it is the most appropriate option. Often, radio buttons or checkboxes are more user-friendly, both because selects can be harder to activate for some, and you cannot add explanations to each option if necessary.</p>
		</template>

		<form-field v-bind="componentProps">
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
		</form-field>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Field label",
		value: "Choose your favourite flavour of ice-cream",
	},
	introduction: {
		label: "Introduction",
		value: "This will be used as a base for your first box.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "We're sorry if your favourite isn't listed, but please pick from one of the options provided.",
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

const template = useTemplateGenerator("form-field", { slots: textSlots, props });
</script>
