<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-wrapper" v-model="textSlots">
		<template #title>
			Form wrapper
		</template>

		<form-wrapper v-model="componentModel" v-bind="componentProps">
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

			<template #submit-button-label>
				{{ textSlots["submit-button-label"]?.value }}
			</template>

			<template #error-summary-title>
				{{ textSlots["error-summary-title"]?.value }}
			</template>
		</form-wrapper>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	"submit-button-label": {
		label: "Submit button label",
		value: "Create account",
	},
	"error-summary-title": {
		label: "Error summary title",
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

const template = useTemplateGenerator("form-field", { slots: textSlots, props, additionalContent });
</script>
