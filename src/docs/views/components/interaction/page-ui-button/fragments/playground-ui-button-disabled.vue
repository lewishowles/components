<template>
	<component-playground
		v-bind="{ copy: template }"
		id="playground-ui-button-disabled"
		v-model="textSlots"
	>
		<template #title>Disabled button</template>

		<template #introduction>
			<p>
				A disabled button communicates that an action is unavailable. Unlike the native
				<code>disabled</code>
				attribute, the
				<code>disabled</code>
				prop uses
				<code>aria-disabled</code>
				, keeping the button in the tab order so screen reader users can still encounter and
				understand it.
			</p>
		</template>

		<ui-button v-bind="componentProps">
			{{ textSlots.default?.value }}
		</ui-button>
	</component-playground>
</template>

<script setup>
import { useUiButtonPlayground } from "@/docs/views/components/interaction/page-ui-button/composables/use-ui-button-playground";

const { componentProps, template, textSlots } = useUiButtonPlayground("disabled");
</script>
