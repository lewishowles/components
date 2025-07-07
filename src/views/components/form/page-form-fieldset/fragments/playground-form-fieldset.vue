<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-fieldset" v-model="textSlots">
		<template #title>
			Fieldset
		</template>

		<form-fieldset>
			<template #title>
				{{ textSlots.title?.value }}
			</template>

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>

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
		</form-fieldset>
	</component-playground>
</template>

<script setup>
import { ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	title: {
		label: "Fieldset label",
		value: "Your details",
	},
	introduction: {
		label: "Introduction",
		value: "We use your details to identify your account should you need help.",
		type: "textarea",
	},
});

const nameFieldTemplate = useTemplateGenerator("form-field", {
	props: {
		name: {
			value: "name",
			isInline: true,
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
			isInline: true,
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

const template = useTemplateGenerator("form-fieldset", { slots: textSlots, additionalContent });
</script>
