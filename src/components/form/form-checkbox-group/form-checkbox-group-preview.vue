<template>
	<preview-wrapper>
		<template #title>
			form-checkbox-group
		</template>

		<preview-section>
			<template #title>
				Basic checkbox group options
			</template>

			<form-layout>
				<form-checkbox-group v-model="model" v-bind="{ options: objectArrayOptions }">
					Favourite ice-cream
				</form-checkbox-group>

				<pre>{{ model }}</pre>

				<div>
					<form-checkbox-group ref="focusableCheckboxGroup" v-bind="{ options: objectArrayOptions }">
						Focusable
					</form-checkbox-group>

					<ui-button class="button--muted mt-4" @click="triggerFocus">
						Focus
					</ui-button>
				</div>

				<form-checkbox-group v-bind="{ options: objectArrayOptions, inline: true }">
					Favourite ice-cream (inline)
				</form-checkbox-group>

				<form-checkbox-group v-bind="{ options: objectArrayOptions }">
					Favourite ice-cream

					<template #help>
						With help text
					</template>
				</form-checkbox-group>

				<form-checkbox-group v-bind="{ options: objectArrayOptions }">
					Favourite ice-cream

					<template #error>
						With an error
					</template>
				</form-checkbox-group>

				<form-checkbox-group v-bind="{ options: objectArrayOptions }">
					Favourite ice-cream

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</form-checkbox-group>
			</form-layout>
		</preview-section>

		<preview-section>
			<template #title>
				With introduction
			</template>

			<form-checkbox-group v-bind="{ options: stringArrayOptions }">
				Favourite ice-cream

				<template #introduction>
					You will be judged based on your answer.
				</template>
			</form-checkbox-group>
		</preview-section>

		<preview-section>
			<template #title>
				With simple object options
			</template>

			<form-checkbox-group v-bind="{ options: objectOptions }">
				Favourite ice-cream
			</form-checkbox-group>
		</preview-section>

		<preview-section>
			<template #title>
				With flat array options
			</template>

			<form-checkbox-group v-bind="{ options: stringArrayOptions }">
				Favourite ice-cream
			</form-checkbox-group>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const model = ref({});
const objectArrayOptions = [{ label: "Chocolate", value: "chocolate" }, { label: "Vanilla", value: "vanilla" }, { label: "Strawberry", value: "strawberry" }];
const objectOptions = { chocolate: "Chocolate", vanilla: "Vanilla", strawberry: "Strawberry" };
const stringArrayOptions = ["Chocolate", "Vanilla", "Strawberry"];

const focusableCheckboxGroup = ref(null);

function triggerFocus() {
	runComponentMethod(focusableCheckboxGroup.value, "triggerFocus");
}
</script>
