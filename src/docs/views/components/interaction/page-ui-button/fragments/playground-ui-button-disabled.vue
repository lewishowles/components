<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-disabled"
		v-model="textSlots"
	>
		<template #title> Disabled button </template>

		<template #introduction>
			<p>
				A disabled button communicates that an action is unavailable. Unlike the native
				<code>disabled</code> attribute, the <code>disabled</code> prop uses
				<code>aria-disabled</code>, keeping the button in the tab order so screen reader users can
				still encounter and understand it.
			</p>
		</template>

		<ui-button v-bind="componentProps">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Button label",
		value: "Submit form",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	disabled: {
		label: "Disabled",
		value: true,
		type: "boolean",
	},
	class: {
		label: "Button classes",
		value: "button--primary",
		isInline: true,
	},
});

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

const template = useTemplateGenerator("ui-button", { slots: textSlots, props });
</script>
