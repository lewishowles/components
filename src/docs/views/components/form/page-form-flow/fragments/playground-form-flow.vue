<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-flow">
		<template #title>Form flow</template>

		<form-flow
			v-model="componentModel"
			v-bind="{ initialData, rules, status: submissionStatus }"
			@submit="submitApplication"
		>
			<template #submit-button-label>Send application</template>

			<form-screen id="contact">
				<template #title>Your contact details</template>
				<template #introduction>We will use these details to respond to your application.</template>

				<form-field name="fullName">Full name</form-field>

				<form-field type="email" name="email">Email address</form-field>
			</form-screen>

			<form-screen id="application" auto-focus="organisation">
				<template #title>Your application</template>
				<template #introduction>Tell us where you work.</template>

				<form-field name="organisation">Organisation</form-field>
			</form-screen>
		</form-flow>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Observed via v-model on form-flow; passed to component-playground to display.
const componentModel = ref({});

// Values shown when the application form first loads.
const initialData = {
	fullName: "Avery Taylor",
	email: "avery.taylor@example.com",
};

// Form-level validation for each stage of the application.
const rules = {
	fullName: [{ rule: "required", message: "Enter your full name." }],
	email: [
		{ rule: "required", message: "Enter your email address." },
		{ rule: "email", message: "Enter an email address in the correct format." },
	],
	organisation: [{ rule: "required", message: "Enter your organisation." }],
};

// Feedback rendered beside the form actions after a successful submission.
const submissionStatus = ref(null);

/**
 * Show a success message after the valid application is submitted.
 *
 * @param  {object}  application
 *     Submitted application values.
 */
function submitApplication(application) {
	submissionStatus.value = {
		type: "success",
		message: `Application sent for ${application.email}.`,
	};
}

// Source code displayed in the playground's copy panel.
const template = useTemplateGenerator("form-flow", {
	props: {
		initialData: {
			type: "object",
			variableName: "initialData",
		},
		rules: {
			type: "object",
			variableName: "rules",
		},
		status: {
			type: "object",
			variableName: "submissionStatus",
		},
	},
	events: {
		submit: { value: "submitApplication" },
	},
	setup: [
		'import { ref } from "vue";',
		"",
		"const initialData = {",
		'\tfullName: "Avery Taylor",',
		'\temail: "avery.taylor@example.com",',
		"};",
		"",
		"const rules = {",
		'\tfullName: [{ rule: "required", message: "Enter your full name." }],',
		"\temail: [",
		'\t\t{ rule: "required", message: "Enter your email address." },',
		'\t\t{ rule: "email", message: "Enter an email address in the correct format." },',
		"\t],",
		'\torganisation: [{ rule: "required", message: "Enter your organisation." }],',
		"};",
		"",
		"const submissionStatus = ref(null);",
		"",
		"function submitApplication(application) {",
		"\tsubmissionStatus.value = {",
		'\t\ttype: "success",',
		"\t\tmessage: `Application sent for ${application.email}.`,",
		"\t};",
		"}",
	].join("\n"),
	additionalContent: [
		"\n\t<template #submit-button-label>Send application</template>",
		'\n\n\t<form-screen id="contact">\n\t\t<template #title>Your contact details</template>\n\t\t<template #introduction>We will use these details to respond to your application.</template>\n\n\t\t<form-field name="fullName">\n\t\t\tFull name\n\t\t</form-field>\n\n\t\t<form-field type="email" name="email">\n\t\t\tEmail address\n\t\t</form-field>\n\t</form-screen>',
		'\n\n\t<form-screen id="application" auto-focus="organisation">\n\t\t<template #title>Your application</template>\n\t\t<template #introduction>Tell us where you work.</template>\n\n\t\t<form-field name="organisation">\n\t\t\tOrganisation\n\t\t</form-field>\n\t</form-screen>',
	],
});
</script>
