<template>
	<component-playground v-bind="{ copy: template }" id="playground-ui-button-icon" v-model="textSlots">
		<template #title>
			Icon button
		</template>

		<template #introduction>
			<p>A button with an icon prefix</p>
		</template>

		<ui-button v-bind="componentProps">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Button label",
		value: "Create account",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	iconStart: {
		label: "Prefix icon",
		value: "icon-user",
	},
	class: {
		label: "Button classes",
		value: "button--primary",
		isInline: true,
	},
});

// Events to use in the template.
const events = ref({
	click: {
		label: "Click handler",
		value: "createAccount",
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(
		Object.entries(props.value).map(([key, prop]) => [key, prop.value]),
	);
});

const template = useTemplateGenerator("ui-button", { slots: textSlots, props, events });
</script>
