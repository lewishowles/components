<template>
	<preview-wrapper>
		<template #title>
			Complete form
		</template>

		<form-layout>
			<form-input class="max-w-sm">
				Your name
			</form-input>

			<radio-group v-bind="{ options: options }">
				Favourite ice-cream

				<template #introduction>
					You will be judged based on your answer.
				</template>
			</radio-group>

			<ui-button class="button--primary">
				Save profile
			</ui-button>
		</form-layout>
	</preview-wrapper>
</template>

<script setup>
import PreviewWrapper from "@/preview/preview-wrapper.vue";
import FormLayout from "@/components/form/form-layout/form-layout.vue";

const options = [{ label: "Chocolate", value: "chocolate" }, { label: "Vanilla", value: "vanilla" }, { label: "Strawberry", value: "strawberry" }];
</script>
