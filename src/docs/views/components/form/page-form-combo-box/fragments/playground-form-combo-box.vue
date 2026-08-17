<template>
	<component-playground
		v-bind="{ copy: template, componentModel }"
		id="playground-form-combo-box"
		v-model="textSlots"
	>
		<template #title>Simple form-combo-box</template>

		<template #introduction>
			<p>A standard form-combo-box.</p>
		</template>

		<form-combo-box v-bind="componentProps" v-model="componentModel">
			<template #label>
				{{ textSlots.label?.value }}
			</template>

			<template #introduction>
				{{ textSlots.introduction?.value }}
			</template>

			<template #help>
				{{ textSlots.help?.value }}
			</template>

			<template #error>
				{{ textSlots.error?.value }}
			</template>
		</form-combo-box>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// The current model value.
const componentModel = ref("");

// Our base text slots, available for the user to update.
const textSlots = ref({
	label: {
		label: "Label",
		value: "Favourite milkshake",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	options: {
		label: "Options",
		value: [
			{ label: "Chocolate", value: "flv_chocolate" },
			{ label: "Banana", value: "flv_banana" },
			{ label: "Vanilla", value: "flv_vanilla" },
			{ label: "Strawberry", value: "flv_strawberry" },
		],
		type: "select",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("form-combo-box", { slots: textSlots, props });
</script>
