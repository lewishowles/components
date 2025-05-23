<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-wrapper" v-model="textSlots">
		<template #title>
			Form wrapper
		</template>

		<template #introduction>
			<p>...</p>
		</template>

		<form-wrapper v-bind="componentProps">
			<template #submit-button-label>
				{{ textSlots.submitButtonLabel?.value }}
			</template>

			<template #error-summary-title>
				{{ textSlots.errorSummaryTitle?.value }}
			</template>
		</form-wrapper>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	submitButtonLabel: {
		label: "Submit button label",
		value: "Create account",
	},
	errorSummaryValue: {
		label: "Error summary value",
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

const { template } = useTemplateGenerator("form-field", textSlots, props);
</script>
