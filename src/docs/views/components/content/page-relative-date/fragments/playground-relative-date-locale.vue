<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-relative-date-locale"
		v-model="textSlots"
	>
		<template #title>Custom locale</template>

		<template #introduction>Display a relative date with a custom locale.</template>

		<relative-date v-bind="componentProps" />
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Props both for the template and for the component example itself.
const props = ref({
	date: {
		label: "Date",
		value: "2025-03-29T13:14:20",
		type: "text",
	},
	relativeTo: {
		label: "Relative to",
		value: "2025-03-29T13:15:20",
		type: "text",
	},
	locale: {
		label: "Locale",
		value: "de-DE",
		type: "text",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("relative-date", { props });
</script>
