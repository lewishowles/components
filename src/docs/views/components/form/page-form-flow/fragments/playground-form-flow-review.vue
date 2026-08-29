<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-flow-review">
		<template #title>Form flow with review</template>

		<form-flow v-model="componentModel" enable-review>
			<template #submit-button-label>Submit application</template>

			<form-screen id="contact">
				<template #title>Your contact details</template>

				<form-field type="email" name="email">Email address</form-field>
			</form-screen>
		</form-flow>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Observed via v-model on form-flow; keeps the review example interactive.
const componentModel = ref({});

const template = useTemplateGenerator("form-flow", {
	props: {
		enableReview: {
			type: "boolean",
		},
	},
	additionalContent: [
		"\n\t<template #submit-button-label>Submit application</template>",
		'\n\n\t<form-screen id="contact">\n\t\t<template #title>Your contact details</template>\n\n\t\t<form-field type="email" name="email">\n\t\t\tEmail address\n\t\t</form-field>\n\t</form-screen>',
	],
});
</script>
