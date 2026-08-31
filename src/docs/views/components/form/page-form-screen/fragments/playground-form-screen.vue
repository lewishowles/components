<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-screen">
		<template #title>Form screen</template>

		<form-flow v-model="componentModel" v-bind="{ rules }">
			<form-screen id="contact">
				<template #title>Contact details</template>
				<template #introduction>Tell us how we can contact you.</template>

				<form-field type="email" name="email">Email address</form-field>
			</form-screen>

			<form-screen id="preferences">
				<template #title>Contact preferences</template>

				<form-field name="preferredContact">Preferred contact method</form-field>
			</form-screen>

			<template #submit-button-label>Save contact details</template>
		</form-flow>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Observed via v-model on the parent form-flow.
const componentModel = ref({});

// Validation runs on the parent flow while this screen is current.
const rules = {
	email: [
		{ rule: "required", message: "Enter your email address." },
		{ rule: "email", message: "Enter an email address in the correct format." },
	],
	preferredContact: [{ rule: "required", message: "Enter a contact method." }],
};

// Source code displayed in the playground's copy panel.
const template = useTemplateGenerator("form-flow", {
	props: {
		rules: {
			type: "object",
		},
	},
	setup: [
		"const rules = {",
		"\temail: [",
		'\t\t{ rule: "required", message: "Enter your email address." },',
		'\t\t{ rule: "email", message: "Enter an email address in the correct format." },',
		"\t],",
		'\tpreferredContact: [{ rule: "required", message: "Enter a contact method." }],',
		"};",
	].join("\n"),
	additionalContent: [
		'\n\t<form-screen id="contact">\n\t\t<template #title>Contact details</template>\n\t\t<template #introduction>Tell us how we can contact you.</template>\n\n\t\t<form-field type="email" name="email">\n\t\t\tEmail address\n\t\t</form-field>\n\t</form-screen>',
		'\n\n\t<form-screen id="preferences">\n\t\t<template #title>Contact preferences</template>\n\n\t\t<form-field name="preferredContact">\n\t\t\tPreferred contact method\n\t\t</form-field>\n\t</form-screen>',
		"\n\n\t<template #submit-button-label>Save contact details</template>",
	],
});
</script>
