<template>
	<div class="flex flex-col gap-8">
		<div class="prose">
			<h3><slot name="title" /></h3>

			<slot name="introduction" />
		</div>

		<div class="p-3 flex justify-end gap-3 border border-grey-300 rounded-md bg-grey-50 text-sm">
			<copy-content v-bind="{ content: copy }" class="button--muted">
				Copy code
			</copy-content>

			<floating-details>
				<template #summary>
					Text slots
				</template>

				<form-layout>
					<form-field v-for="(slot, key) in textSlots" :key="key" v-bind="{ type: slot.type }" v-model="textSlots[key].value">
						{{ slot.label }}
					</form-field>
				</form-layout>
			</floating-details>
		</div>

		<div class="inset-shadow-sm p-24 rounded-md border border-grey-300">
			<slot />
		</div>
	</div>
</template>

<script setup>
defineProps({
	/**
	 * The template ot copy.
	 */
	copy: {
		type: String,
		default: null,
	},
});

// We define our text slots as our model so that we can easily access their
// values both here and in the parent component.
const textSlots = defineModel({
	type: Object,
});
</script>
