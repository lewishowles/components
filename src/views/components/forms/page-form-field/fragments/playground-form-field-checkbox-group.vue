<template>
	<component-playground v-bind="{ copy: template }" id="playground-form-field-checkbox-group" v-model="textSlots">
		<template #title>
			Checkbox group
		</template>

		<template #introduction>
			<p>Allow a user to select one or more options from those available. A checkbox group differs from a singular checkbox in that the <code>value</code> of each selected checkbox is returned.</p>
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
		value: "Select the reasons you think Tails is better than Sonic",
	},
	help: {
		label: "Help text",
		value: "",
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
		value: ["Two tails", "Orange", "Can fly"],
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
