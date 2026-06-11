<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-reactive"
		v-model="textSlots"
	>
		<template #title>Reactive button</template>

		<template #introduction>
			<p>A button that reacts, giving user feedback, on activation.</p>
		</template>

		<ui-button v-bind="componentProps">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { useUiButtonPlayground } from "@/docs/views/components/interaction/page-ui-button/composables/use-ui-button-playground";

const { componentProps, template, textSlots } = useUiButtonPlayground("reactive");
</script>
