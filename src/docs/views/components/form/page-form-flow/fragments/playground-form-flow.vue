<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-flow">
		<template #title>Form flow</template>

		<form-flow v-model="componentModel" v-bind="{ rules }">
			<template #submit-button-label>Create account</template>

			<form-screen id="account">
				<form-field type="email" name="email">Email address</form-field>
			</form-screen>

			<form-screen id="profile" auto-focus="name">
				<form-field name="name">Display name</form-field>
			</form-screen>
		</form-flow>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Observed via v-model on form-flow; passed to component-playground to display.
const componentModel = ref({});

// A required email lets this playground demonstrate a blocked Continue, with the resulting error summary and focus landing on the invalid field.
const rules = {
	email: [
		{ rule: "required", message: "Enter your email address" },
		{ rule: "email", message: "Enter an email address" },
	],
};

const template = useTemplateGenerator("form-flow", {
	props: {
		rules: {
			type: "object",
			variableName: "rules",
		},
	},
	// Displayed literally in the copy-code panel; keep this in sync with the
	// `rules` const above if either changes.
	setup: [
		"const rules = {",
		"\temail: [",
		'\t\t{ rule: "required", message: "Enter your email address" },',
		'\t\t{ rule: "email", message: "Enter an email address" },',
		"\t],",
		"};",
	].join("\n"),
	additionalContent: [
		"\n\t<template #submit-button-label>Create account</template>",
		'\n\n\t<form-screen id="account">\n\t\t<form-field type="email" name="email">\n\t\t\tEmail address\n\t\t</form-field>\n\t</form-screen>',
		'\n\n\t<form-screen id="profile" auto-focus="name">\n\t\t<form-field name="name">\n\t\t\tDisplay name\n\t\t</form-field>\n\t</form-screen>',
	],
});
</script>
