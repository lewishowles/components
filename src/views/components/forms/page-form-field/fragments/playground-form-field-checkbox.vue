<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-field-checkbox" v-model="textSlots">
		<template #title>
			Checkbox
		</template>

		<template #introduction>
			<p>Allow the user to select a single checkbox, to confirm terms, for example. A single checkbox returns <code>true</code> or <code>false</code> depending on whether it's checked.</p>
		</template>

		<form-field v-bind="componentProps">
			{{ textSlots.label?.value }}

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
		value: "I would love to sign up to the newsletter and get 10% off my next order",
	},
	help: {
		label: "Help text",
		value: "When you confirm your newsletter subscription, we'll send you an email with your exclusive discount code.",
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
		value: "checkbox",
		type: "text",
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
