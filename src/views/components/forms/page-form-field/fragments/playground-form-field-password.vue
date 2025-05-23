<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-field-password" v-model="textSlots">
		<template #title>
			Password
		</template>

		<template #introduction>
			<p>Password is a variant of <code>text</code>, automatically applying a <code>type</code> of <code>password</code>.</p>
		</template>

		<form-field v-model="componentModel" v-bind="componentProps">
			{{ textSlots.default?.value }}

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

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Field label",
		value: "Password",
	},
	introduction: {
		label: "Introduction",
		value: "Please make your password as complex as you're comfortable with.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "You can change your password later in your account settings.",
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
		value: "password",
		type: "text",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("form-field", { slots: textSlots, props });
</script>
