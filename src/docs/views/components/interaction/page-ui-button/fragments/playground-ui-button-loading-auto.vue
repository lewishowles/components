<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-loading-auto"
		v-model="textSlots"
	>
		<template #title> Auto-loading button </template>

		<template #introduction>
			<p>
				When a button is <code>reactive</code>, its <code>loadingAuto</code> defaults to true. The
				button detects a Promise returned by the click handler and automatically enters its loading
				state, resetting when the Promise resolves or rejects. Click the button below to see it in
				action.
			</p>
		</template>

		<div class="flex items-center gap-4">
			<ui-button v-bind="componentProps" @click="simulateSave">
				{{ textSlots.default?.value }}
			</ui-button>

			<span v-show="processing">Saving…</span>
			<span v-show="saveComplete">Saved!</span>
		</div>
	</component-playground>
</template>

<script setup>
import { computed, ref } from "vue";
import useTemplateGenerator from "@/docs/views/components/composables/use-template-generator/use-template-generator";

// Our base text slots, available for the user to update.
const textSlots = ref({
	default: {
		label: "Button label",
		value: "Save changes",
	},
});

// Props both for the template and for the component example itself.
const props = ref({
	reactive: {
		label: "Reactive",
		value: true,
		type: "boolean",
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
		value: "save",
	},
});

// A processing flag to demonstrate when our async function is invoked.
const processing = ref(false);
// Mock a "save complete" state so that we can demonstrate a workflow to the
// user.
const saveComplete = ref(false);

// Convert our props into a format that can be passed directly to our component.
const componentProps = computed(() => {
	return Object.fromEntries(Object.entries(props.value).map(([key, prop]) => [key, prop.value]));
});

// Simulate an async operation to demonstrate loadingAuto.
async function simulateSave() {
	processing.value = true;
	saveComplete.value = false;

	await new Promise((resolve) => setTimeout(resolve, 2000));

	processing.value = false;
	saveComplete.value = true;
}

const template = useTemplateGenerator("ui-button", { slots: textSlots, props, events });
</script>
