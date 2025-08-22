<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-field-checkbox-group" v-model="textSlots">
		<template #title>
			Checkbox group
		</template>

		<template #introduction>
			<p>Allow a user to select one or more options from those available. A checkbox group differs from a singular checkbox in that the <code>value</code> of each selected checkbox is returned.</p>
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
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Field label",
		value: "Why is Tails is cooler than Sonic?",
	},
	introduction: {
		label: "Introduction",
		value: "We know it's true, but let's find out why.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "You can select as many answers as you see fit.",
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
		value: "checkbox-group",
		type: "text",
	},
	options: {
		label: "Options",
		value: ["He has two tails", "He's orange", "He can fly"],
		type: "select",
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
