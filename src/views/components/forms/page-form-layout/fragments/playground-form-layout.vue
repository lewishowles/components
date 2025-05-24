<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-fieldset" v-model="textSlots">
		<template #title>
			Fieldset
		</template>

		<form-layout>
			<form-field name="name">
				Your name

				<template #introduction>
					We will only use your name to address you in your account and communications, and will not pass it on to third parties.
				</template>

				<template #help>
					Please use the name you wish to be addressed by, even if this is different to your legal name.
				</template>
			</form-field>

			<form-field type="email" name="email">
				Email address

				<template #introduction>
					We will not use your email address for marketing purposes.
				</template>

				<template #help>
					You can change your email address later in your account settings.
				</template>
			</form-field>
		</form-layout>
	</component-playground>
</template>

<script setup>
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

const nameFieldTemplate = useTemplateGenerator("form-field", {
	props: {
		name: {
			value: "name",
			inline: true,
		},
	},
	slots: {
		default: {
			value: "Your name",
		},

		introduction: {
			value: "We will only use your name to address you in your account and communications, and will not pass it on to third parties.",
		},

		help: {
			value: "Please use the name you wish to be addressed by, even if this is different to your legal name.",
		},
	},
	indent: 1,
});

const emailFieldTemplate = useTemplateGenerator("form-field", {
	props: {
		name: {
			value: "email",
			inline: true,
		},
	},
	slots: {
		default: {
			value: "Email address",
		},

		introduction: {
			value: "We will not use your email address for marketing purposes.",
		},

		help: {
			value: "You can change your email address later in your account settings.",
		},
	},
	indent: 1,
});

const additionalContent = [
	nameFieldTemplate,
	emailFieldTemplate,
];

const template = useTemplateGenerator("form-layout", { additionalContent });
</script>
