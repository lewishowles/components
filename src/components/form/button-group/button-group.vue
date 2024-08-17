<template>
	<radio-group data-test="button-group">
		<slot name="default" />

		<template #options="{ options, name }">
			<div class="mt-2 flex">
				<div v-for="option in options" :key="option.id">
					<input v-model="model" type="radio" class="peer sr-only" v-bind="{ id: option.id, value: option.value, name }" />

					<form-label
						v-bind="{ id: option.id, styled: false }"
						class="cursor-pointer border border-grey-300 px-3 py-2 transition-all hover:bg-grey-50 hover:ring-grey-400 peer-checked:border-purple-800 peer-checked:bg-purple-800 peer-checked:text-white peer-focus:ring-2 peer-focus:ring-purple-800 peer-focus:ring-offset-2"
						:class="{
							'border-s-0': !option.first,
							'rounded-s-lg': option.first,
							'rounded-e-lg': option.last,
						}"
					>
						{{ option.label }}
					</form-label>
				</div>
			</div>
		</template>

		<template #introduction>
			<slot name="introduction" />
		</template>
		<template #error>
			<slot name="error" />
		</template>
		<template #help>
			<slot name="help" />
		</template>
	</radio-group>
</template>

<script setup>
import FormLabel from "@/components/form/form-label/form-label.vue";

const model = defineModel({
	type: String,
});
</script>
