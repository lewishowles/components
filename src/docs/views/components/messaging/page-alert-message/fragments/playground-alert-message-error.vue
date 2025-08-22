<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-alert-message" v-model="textSlots">
		<template #title>
			Error message
		</template>

		<alert-message v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}

			<template #title>
				{{ textSlots.title?.value }}
			</template>
		</alert-message>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Our base text slots, available for the user to update.
const textSlots = ref({
	title: {
		label: "Title",
		value: "Error creating user",
	},
	default: {
		label: "Message",
		value: "The user could not be created as their email address already exists in the system.",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	type: {
		label: "Type",
		value: "error",
		type: "string",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("alert-message", { slots: textSlots, props });
</script>
