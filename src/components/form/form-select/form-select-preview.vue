<template>
	<preview-wrapper>
		<template #title>
			form-select
		</template>

		<preview-section>
			<template #title>
				Basic field options
			</template>

			<form-layout class="max-w-sm">
				<form-select v-model="character" v-bind="{ options }">
					Wazowski or Sullivan (modelled)
				</form-select>

				<pre>Value: {{ character }}</pre>

				<form-select v-model="extendedCharacter" v-bind="{ options: extendedOptions }">
					With differing labels and values
				</form-select>

				<pre>Value: {{ extendedCharacter }}</pre>

				<div>
					<form-select ref="focusable-field" v-bind="{ options }">
						Focusable
					</form-select>

					<ui-button class="button--muted mt-4" @click="triggerFocus">
						Focus
					</ui-button>
				</div>

				<form-select v-bind="{ options }">
					Wazowski or Sullivan

					<template #help>
						With help text
					</template>
				</form-select>

				<form-select v-bind="{ options }">
					Wazowski or Sullivan

					<template #error>
						With an error
					</template>
				</form-select>

				<form-select v-bind="{ options }">
					Wazowski or Sullivan

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</form-select>

				<form-select v-bind="{ options }" />
			</form-layout>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref, useTemplateRef } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const options = ref(["Mike Wazowski", "James P. Sullivan"]);
const character = ref("");
const extendedCharacter = ref("");
const focusableField = useTemplateRef("focusable-field");

function triggerFocus() {
	runComponentMethod(focusableField.value, "triggerFocus");
}
</script>
