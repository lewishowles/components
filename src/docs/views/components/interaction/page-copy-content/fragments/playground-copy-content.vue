<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-copy-content" v-model="textSlots">
		<template #title>
			Copy content
		</template>

		<copy-content v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}
		</copy-content>
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
		label: "",
		value: "Copy quote",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	content: {
		label: "Content to copy",
		value: "That might sound boring, but I think the boring stuff is the stuff I remember the most",
		type: "text",
		isVariable: true,
	},
	class: {
		label: "Class",
		value: "button--muted",
		type: "text",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("copy-content", { slots: textSlots, props });
</script>
