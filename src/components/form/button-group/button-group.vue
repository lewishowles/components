<template>
	<radio-group data-test="button-group">
		<slot name="default" />

		<template #options="{ options, name }">
			<div class="mt-1 flex">
				<div v-for="option in options" :key="option.id">
					<input v-model="model" type="radio" class="peer sr-only" v-bind="{ id: option.id, value: option.value, name }" />

					<form-label
						v-bind="{ id: option.id, styled: false }"
						class="button-group flex items-center gap-2"
						:class="{
							'button-group--middle': !option.first,
							'button-group--first': option.first,
							'button-group--last': option.last,
						}"
					>
						<component :is="option.icon" v-if="option.icon" />

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
/**
 * Create a group of radio buttons styled as buttons, based on provided options.
 *
 * `button-group` allows options to be provided in a few different formats for
 * simplicity.
 */
import FormLabel from "@/components/form/form-label/form-label.vue";

const model = defineModel({
	type: String,
});
</script>
