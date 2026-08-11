<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-input-prefix-suffix"
		v-model="textSlots"
	>
		<template #title>Form input with prefix and suffix</template>

		<form-input v-model="componentModel">
			{{ textSlots.default?.value }}

			<template #prefix>$</template>

			<template #suffix>.00</template>
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
		value: "Amount",
	},
});

// The fixed slots displayed alongside the field label.
const slots = computed(() => ({
	...textSlots.value,
	prefix: {
		value: "$",
	},
	suffix: {
		value: ".00",
	},
}));

const template = useTemplateGenerator("form-input", { slots });
</script>
