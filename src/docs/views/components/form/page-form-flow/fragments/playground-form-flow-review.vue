<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-flow-review">
		<template #title>Form flow with review</template>

		<form-flow
			v-model="componentModel"
			v-bind="{ enableReview: true, initialData, rules, status: submissionStatus }"
			@submit="submitApplication"
		>
			<template #submit-button-label>Submit application</template>

			<form-screen id="contact">
				<template #title>Your contact details</template>

				<form-field name="fullName">Full name</form-field>

				<form-field type="email" name="email">Email address</form-field>
			</form-screen>

			<form-screen id="application">
				<template #title>Your application</template>

				<form-field name="organisation">Organisation</form-field>
			</form-screen>
		</form-flow>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Observed via v-model on form-flow; keeps the review example interactive.
const componentModel = ref({});

// Values available to check on the review destination.
const initialData = {
	fullName: "Avery Taylor",
	email: "avery.taylor@example.com",
	organisation: "Northbridge Studio",
};

// Validation remains active when a user replaces the seeded values.
const rules = {
	fullName: [{ rule: "required", message: "Enter your full name." }],
	email: [{ rule: "required", message: "Enter your email address." }],
	organisation: [{ rule: "required", message: "Enter your organisation." }],
};

// Feedback rendered after review and final submission.
const submissionStatus = ref(null);

/**
 * Show a success message after the reviewed application is submitted.
 *
 * @param  {object}  application
 *     Submitted application values.
 */
function submitApplication(application) {
	submissionStatus.value = {
		type: "success",
		message: `Application submitted for ${application.fullName}.`,
	};
}

// Source code displayed in the playground's copy panel.
const template = useTemplateGenerator("form-flow", {
	props: {
		enableReview: {
			type: "boolean",
			value: true,
		},
		initialData: {
			type: "object",
		},
		rules: {
			type: "object",
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
		'\torganisation: "Northbridge Studio",',
		"};",
		"",
		"const rules = {",
		'\tfullName: [{ rule: "required", message: "Enter your full name." }],',
		'\temail: [{ rule: "required", message: "Enter your email address." }],',
		'\torganisation: [{ rule: "required", message: "Enter your organisation." }],',
		"};",
		"",
		"const submissionStatus = ref(null);",
		"",
		"function submitApplication(application) {",
		"\tsubmissionStatus.value = {",
		'\t\ttype: "success",',
		"\t\tmessage: `Application submitted for ${application.fullName}.`,",
		"\t};",
		"}",
	].join("\n"),
	additionalContent: [
		"\n\t<template #submit-button-label>Submit application</template>",
		'\n\n\t<form-screen id="contact">\n\t\t<template #title>Your contact details</template>\n\n\t\t<form-field name="fullName">\n\t\t\tFull name\n\t\t</form-field>\n\n\t\t<form-field type="email" name="email">\n\t\t\tEmail address\n\t\t</form-field>\n\t</form-screen>',
		'\n\n\t<form-screen id="application">\n\t\t<template #title>Your application</template>\n\n\t\t<form-field name="organisation">\n\t\t\tOrganisation\n\t\t</form-field>\n\t</form-screen>',
	],
});
</script>
