<template>
	<preview-wrapper>
		<template #title>
			button-group
		</template>

		<preview-section>
			<template #title>
				Basic radio options
			</template>

			<form-layout>
				<button-group v-bind="{ options }">
					Favourite ice-cream
				</button-group>

				<button-group v-bind="{ options }">
					Favourite ice-cream

					<template #help>
						With help text
					</template>
				</button-group>

				<button-group v-bind="{ options }">
					Favourite ice-cream

					<template #error>
						With an error
					</template>
				</button-group>

				<button-group v-bind="{ options }">
					Favourite ice-cream

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</button-group>
			</form-layout>
		</preview-section>

		<preview-section>
			<template #title>
				With introduction
			</template>

			<button-group v-bind="{ options: flatArrayOptions }">
				Favourite ice-cream

				<template #introduction>
					You will be judged based on your answer.
				</template>
			</button-group>
		</preview-section>

		<preview-section>
			<template #title>
				With simple object options
			</template>

			<button-group v-bind="{ options: objectOptions }">
				Favourite ice-cream
			</button-group>
		</preview-section>

		<preview-section>
			<template #title>
				With flat array options
			</template>

			<button-group v-bind="{ options: flatArrayOptions }">
				Favourite ice-cream
			</button-group>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
const options = [{ label: "Chocolate", value: "chocolate" }, { label: "Vanilla", value: "vanilla" }, { label: "Strawberry", value: "strawberry" }];
const objectOptions = { chocolate: "Chocolate", vanilla: "Vanilla", strawberry: "Strawberry" };
const flatArrayOptions = ["Chocolate", "Vanilla", "Strawberry"];
</script>
