<template>
	<component-playground v-bind="{ copy: template }" id="playground-pill-badge" v-model="textSlots">
		<template #title>
			Simple pill badge
		</template>

		<pill-badge v-bind="componentProps">
			{{ textSlots.default?.value }}
		</pill-badge>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Text",
		value: "Active",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	colour: {
		label: "Colour",
		value: "green",
		type: "text",
		inline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("pill-badge", { slots: textSlots, props });
</script>
