<template>
	<preview-wrapper>
		<template #title>
			radio-group
		</template>

		<preview-section>
			<template #title>
				Basic radio options
			</template>

			<form-radio-group v-model="model" v-bind="{ options: objectArrayOptions }">
				Favourite ice-cream
			</form-radio-group>

			<pre>{{ model }}</pre>

			<div>
				<form-radio-group ref="focusableRadio" v-bind="{ options: objectArrayOptions }">
					Focusable
				</form-radio-group>

				<ui-button class="button--muted mt-4" @click="triggerFocus">
					Focus
				</ui-button>
			</div>

			<form-radio-group v-bind="{ options: objectArrayOptions, inline: true }">
				Favourite ice-cream (inline)
			</form-radio-group>

			<form-radio-group v-bind="{ options: objectArrayOptions }">
				Favourite ice-cream

				<template #help>
					With help text
				</template>
			</form-radio-group>

			<form-radio-group v-bind="{ options: objectArrayOptions }">
				Favourite ice-cream

				<template #error>
					With an error
				</template>
			</form-radio-group>

			<form-radio-group v-bind="{ options: objectArrayOptions }">
				Favourite ice-cream

				<template #help>
					With help text
				</template>

				<template #error>
					With an error
				</template>
			</form-radio-group>
		</preview-section>

		<preview-section>
			<template #title>
				With introduction
			</template>

			<form-radio-group v-bind="{ options: stringArrayOptions }">
				Favourite ice-cream

				<template #introduction>
					You will be judged based on your answer.
				</template>
			</form-radio-group>
		</preview-section>

		<preview-section>
			<template #title>
				With simple object options
			</template>

			<form-radio-group v-bind="{ options: objectOptions }">
				Favourite ice-cream
			</form-radio-group>
		</preview-section>

		<preview-section>
			<template #title>
				With flat array options
			</template>

			<form-radio-group v-bind="{ options: stringArrayOptions }">
				Favourite ice-cream
			</form-radio-group>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const model = ref(null);
const objectArrayOptions = [{ label: "Chocolate", value: "chocolate" }, { label: "Vanilla", value: "vanilla" }, { label: "Strawberry", value: "strawberry" }];
const objectOptions = { chocolate: "Chocolate", vanilla: "Vanilla", strawberry: "Strawberry" };
const stringArrayOptions = ["Chocolate", "Vanilla", "Strawberry"];

const focusableRadio = ref(null);

function triggerFocus() {
	runComponentMethod(focusableRadio.value, "triggerFocus");
}
</script>
