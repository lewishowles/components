<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-progress-bar-indeterminate"
	>
		<template #title> Indeterminate </template>

		<progress-bar v-bind="componentProps" v-model="componentModel" />
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(null);

// Props both for the template and for the component example itself.
const props = ref({
	current: {
		label: "Current",
		value: null,
		type: "null",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("progress-bar", { props });
</script>
