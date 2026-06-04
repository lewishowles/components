<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-{{ NAME | kebab }}"
		v-model="textSlots"
	>
		<template #title> Simple {{ NAME | kebab }} </template>

		<template #introduction>
			<p>A standard {{ NAME | kebab }}.</p>
		</template>

		<{{ NAME | kebab }} v-bind="componentProps" v-model="componentModel">
			{{ textSlots.default?.value }}
		</{{ NAME | kebab }}>
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
		label: "Default slot",
		value: "Example content",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	example: {
		label: "example",
		value: null,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("{{ NAME | kebab }}", { slots: textSlots, props });
</script>
