<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-field-radio-group" v-model="textSlots">
		<template #title>
			Button group
		</template>

		<template #introduction>
			<p>A button group is a variant of radio group, designed for a more succinct choice between options.</p>
		</template>

		<form-field v-bind="componentProps">
			{{ textSlots.label.value }}

			<template #help>
				{{ textSlots.help.value }}
			</template>

			<template #error>
				{{ textSlots.error.value }}
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
		value: "Application theme",
	},
	help: {
		label: "Help text",
		value: "You can return to your application at any time if you choose not to continue.",
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
		value: "button-group",
		type: "text",
	},
	options: {
		label: "Options",
		value: ["Light", "Dark", "System"],
		type: "select",
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
