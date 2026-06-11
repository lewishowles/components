<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-reactive"
		v-model="textSlots"
	>
		<template #title>Wide button</template>

		<template #introduction>
			<p>A button that is wider than its contents should centre those contents.</p>
		</template>

		<ui-button v-bind="componentProps">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { useUiButtonPlayground } from "@/docs/views/components/interaction/page-ui-button/composables/use-ui-button-playground";

const { componentProps, template, textSlots } = useUiButtonPlayground("full-width");
</script>
