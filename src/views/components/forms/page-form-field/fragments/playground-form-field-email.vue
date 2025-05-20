<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-field-email" v-model="textSlots">
		<template #title>
			Email
		</template>

		<template #introduction>
			<p>Email is a variant of <code>text</code>, automatically applying a <code>type</code> of <code>email</code>.</p>
		</template>

		<form-field v-bind="componentProps">
			{{ textSlots.label?.value }}

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>

			<template #help>
				{{ textSlots.help?.value }}
			</template>

			<template #error>
				{{ textSlots.error?.value }}
			</template>
		</form-field>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Field label",
		value: "Email address",
	},
	introduction: {
		label: "Introduction",
		value: "We will not use your email address for marketing purposes.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "You can change your email address later in your account settings.",
		type: "textarea",
	},
	error: {
		label: "Error text",
		value: "",
		type: "textarea",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	type: {
		label: "Type",
		value: "email",
		type: "text",
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
