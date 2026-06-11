<template>
	<component-playground v-bind="{ copy: template }" id="playground-ui-button" v-model="textSlots">
		<template #title>Simple button</template>

		<template #introduction>
			<p>A simple UI button</p>
		</template>

		<ui-button v-bind="componentProps">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { useUiButtonPlayground } from "@/docs/views/components/interaction/page-ui-button/composables/use-ui-button-playground";

const { componentProps, template, textSlots } = useUiButtonPlayground("default");
</script>
