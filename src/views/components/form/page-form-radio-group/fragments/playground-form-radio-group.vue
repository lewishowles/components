<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-radio-group" v-model="textSlots">
		<template #title>
			Form radio group
		</template>

		<form-radio-group v-bind="componentProps" v-model="componentModel">
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
		</form-radio-group>
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
		value: "Would you like to continue with your application?",
	},
	introduction: {
		label: "Introduction",
		value: "You can return to your application at any time if you choose not to continue.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "All of your data up to this point has been saved.",
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
	options: {
		label: "Options",
		value: ["Yes", "No"],
		type: "select",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("form-radio-group", { slots: textSlots, props });
</script>
