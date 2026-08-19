<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-field-combo-box"
		v-model="textSlots"
	>
		<template #title>Combo box</template>

		<template #introduction>
			<p>
				Search a list of known options before selecting one. The text input shows the option label,
				while
				<code>v-model</code>
				stores its value.
			</p>
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
const componentModel = ref("");

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Field label",
		value: "Choose a milkshake",
	},
	introduction: {
		label: "Introduction",
		value: "Search by name, then select a choice from the available options.",
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
		value: "combo-box",
		type: "text",
	},
	options: {
		label: "Options",
		value: ["Vanilla", "Chocolate", "Banana", "Snickers"],
		type: "select",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("form-field", { slots: textSlots, props });
</script>
