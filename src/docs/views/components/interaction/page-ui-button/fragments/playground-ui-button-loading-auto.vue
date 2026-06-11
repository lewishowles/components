<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-loading-auto"
		v-model="textSlots"
	>
		<template #title>{{ snippetVariant.label }}</template>

		<template #introduction>
			<p>{{ snippetVariant.description }}</p>
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
import { ref } from "vue";
import { uiButtonMetadata } from "@/components/interaction/ui-button/ui-button.metadata.js";
import { useComponentPlayground } from "@/docs/views/components/composables/use-component-playground/use-component-playground";

// A processing flag to demonstrate when our async function is invoked.
const processing = ref(false);
// Mock a "save complete" state so that we can demonstrate a workflow to the user.
const saveComplete = ref(false);

const { componentProps, snippetVariant, template, textSlots } = useComponentPlayground(
	uiButtonMetadata,
	"loading-auto",
);

// Simulate an async operation to demonstrate loadingAuto.
async function simulateSave() {
	processing.value = true;
	saveComplete.value = false;

	await new Promise((resolve) => setTimeout(resolve, 2000));

	processing.value = false;
	saveComplete.value = true;
}
</script>
