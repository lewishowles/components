<template>
	<preview-wrapper>
		<template #title>
			Complete form
		</template>

		<div class="flex gap-8">
			<form-layout class="w-full max-w-lg rounded-md border border-grey-200 p-6">
				<form-input v-model="name">
					Your name
				</form-input>

				<radio-group v-bind="{ options: selectOptions }" v-model="favouriteIceCream">
					Favourite ice-cream

					<template #introduction>
						You will be judged based on your answer.
					</template>
				</radio-group>

				<button-group v-bind="{ options: buttonGroupOptions }" v-model="theme">
					Theme
				</button-group>

				<form-actions class="mx-[calc(-1.5rem+4px)] mb-[calc(-1.5rem+4px)] rounded-[3px] bg-grey-50 p-[calc(1.5rem-4px)]">
					<ui-button class="button--primary">
						Save profile
					</ui-button>
				</form-actions>
			</form-layout>

			<pre class="grow rounded-md border border-grey-200 p-6">{{ { name, favouriteIceCream, theme } }}</pre>
		</div>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const name = ref("");
const favouriteIceCream = ref("");
const theme = ref("");
const selectOptions = ["Chocolate", "Vanilla", "Strawberry"];
const buttonGroupOptions = ["System", "Light", "Dark"];
</script>
