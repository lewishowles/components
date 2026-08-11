<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-input-icon"
		v-model="textSlots"
	>
		<template #title>Form input with icon</template>

		<form-input v-model="componentModel">
			{{ textSlots.default?.value }}

			<template #prefix>
				<icon-search />
			</template>
		</form-input>
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
		label: "Field label",
		value: "Search",
	},
});

// The fixed icon displayed before the field label.
const slots = computed(() => ({
	...textSlots.value,
	prefix: {
		value: "<icon-search />",
	},
}));

const template = useTemplateGenerator("form-input", { slots });
</script>
