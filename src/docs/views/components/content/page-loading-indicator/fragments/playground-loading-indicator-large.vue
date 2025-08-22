<template>
	<component-playground v-bind="{ copy: template }" id="playground-loading-indicator" v-model="textSlots">
		<template #title>
			Large indicator
		</template>

		<template #introduction>
			A larger loading indicator, more suited to when a whole section of content is pending.
		</template>

		<loading-indicator v-bind="componentProps">
			{{ textSlots.default?.value }}
		</loading-indicator>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Default text",
		value: "Loading users…",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	large: {
		label: "Large",
		value: true,
		type: "boolean",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("loading-indicator", { slots: textSlots, props });
</script>
