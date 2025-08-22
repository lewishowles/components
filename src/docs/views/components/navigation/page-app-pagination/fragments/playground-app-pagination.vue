<template>
	<component-playground v-bind="{ copy: template, componentModel }" id="playground-app-pagination" v-model="textSlots">
		<template #title>
			App pagination
		</template>

		<template #introduction>
			<p />
		</template>

		<app-pagination v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}
		</app-pagination>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref(1);

// Props both for the template and for the component example itself.
const props = ref({
	count: {
		label: "Count",
		value: 100,
		type: "number",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("app-pagination", { props });
</script>
