<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-form-field-textarea" v-model="textSlots">
		<template #title>
			Textarea
		</template>

		<template #introduction>
			<p>A larger input that invites the user to enter longer strings of text. As with a text input, when using a textarea, it is strongly recommended that a visible label is used, and that the placeholder is not used for meaningful information, as this can cause some users to lose context. Use the label to describe the information required of the user, and help text for any additional explanation that would be useful.</p>
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
		value: "About you",
	},
	introduction: {
		label: "Introduction",
		value: "This will be displayed on your profile and will be visible to other users of the website.",
		type: "textarea",
	},
	help: {
		label: "Help text",
		value: "You can use basic Markdown such as **bold** and _italic_.",
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
		value: "textarea",
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
