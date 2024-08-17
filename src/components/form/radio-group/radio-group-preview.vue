<template>
	<preview-wrapper>
		<template #title>
			radio-group
		</template>

		<preview-section>
			<template #title>
				Basic radio options
			</template>

			<form-layout>
				<radio-group v-model="selectedValue" v-bind="{ options }">
					Favourite ice-cream
				</radio-group>

				<radio-group v-bind="{ options, inline: true }">
					Favourite ice-cream (inline)
				</radio-group>

				<radio-group v-bind="{ options }">
					Favourite ice-cream

					<template #help>
						With help text
					</template>
				</radio-group>

				<radio-group v-bind="{ options }">
					Favourite ice-cream

					<template #error>
						With an error
					</template>
				</radio-group>

				<radio-group v-bind="{ options }">
					Favourite ice-cream

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</radio-group>
			</form-layout>
		</preview-section>

		<preview-section>
			<template #title>
				With introduction
			</template>

			<radio-group v-bind="{ options: flatArrayOptions }">
				Favourite ice-cream

				<template #introduction>
					You will be judged based on your answer.
				</template>
			</radio-group>
		</preview-section>

		<preview-section>
			<template #title>
				With simple object options
			</template>

			<radio-group v-bind="{ options: objectOptions }">
				Favourite ice-cream
			</radio-group>
		</preview-section>

		<preview-section>
			<template #title>
				With flat array options
			</template>

			<radio-group v-bind="{ options: flatArrayOptions }">
				Favourite ice-cream
			</radio-group>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
const options = [{ label: "Chocolate", value: "chocolate" }, { label: "Vanilla", value: "vanilla" }, { label: "Strawberry", value: "strawberry" }];
const objectOptions = { chocolate: "Chocolate", vanilla: "Vanilla", strawberry: "Strawberry" };
const flatArrayOptions = ["Chocolate", "Vanilla", "Strawberry"];
</script>
