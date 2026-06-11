<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-loading-auto"
		v-model="textSlots"
	>
		<template #title>Auto-loading button</template>

		<template #introduction>
			<p>
				When a button is
				<code>reactive</code>
				, its
				<code>loadingAuto</code>
				defaults to true. The button detects a Promise returned by the click handler and
				automatically enters its loading state, resetting when the Promise resolves or rejects.
				Click the button below to see it in action.
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
import { ref } from "vue";
import { useUiButtonPlayground } from "@/docs/views/components/interaction/page-ui-button/composables/use-ui-button-playground";

// A processing flag to demonstrate when our async function is invoked.
const processing = ref(false);
// Mock a "save complete" state so that we can demonstrate a workflow to the
// user.
const saveComplete = ref(false);

const { componentProps, template, textSlots } = useUiButtonPlayground("loading-auto");

// Simulate an async operation to demonstrate loadingAuto.
async function simulateSave() {
	processing.value = true;
	saveComplete.value = false;

	await new Promise((resolve) => setTimeout(resolve, 2000));

	processing.value = false;
	saveComplete.value = true;
}
</script>
