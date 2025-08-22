<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-checkbox" v-model="textSlots">
		<template #title>
			Form checkbox
		</template>

		<form-checkbox v-model="componentModel">
			{{ textSlots.default?.value }}

			<template #help>
				{{ textSlots.help?.value }}
			</template>

			<template #error>
				{{ textSlots.error?.value }}
			</template>
		</form-checkbox>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

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

const template = useTemplateGenerator("form-checkbox", { slots: textSlots });
</script>
