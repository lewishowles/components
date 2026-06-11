<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-icon"
		v-model="textSlots"
	>
		<template #title>Icon button</template>

		<template #introduction>
			<p>A button with an icon prefix</p>
		</template>

		<ui-button v-bind="componentProps">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { useUiButtonPlayground } from "@/docs/views/components/interaction/page-ui-button/composables/use-ui-button-playground";

const { componentProps, template, textSlots } = useUiButtonPlayground("icon");
</script>
