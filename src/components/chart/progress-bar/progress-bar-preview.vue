<template>
	<preview-wrapper>
		<template #title>
			progress-bar
		</template>

		<preview-section>
			<template #title>
				Fixed value
			</template>

			<progress-bar v-bind="{ value: 5, min: 0, max: 10 }" />
		</preview-section>

		<preview-section>
			<template #title>
				Value below minimum
			</template>

			<progress-bar v-bind="{ value: 0, min: 5, max: 10 }" />
		</preview-section>

		<preview-section>
			<template #title>
				Value above maximum
			</template>

			<progress-bar v-bind="{ value: 10, min: 0, max: 5 }" />
		</preview-section>

		<preview-section>
			<template #title>
				Increasing value
			</template>

			<progress-bar v-bind="{ value, min: 0, max: 10 }" />
		</preview-section>

		<preview-section>
			<template #title>
				Showing the label
			</template>

			<progress-bar v-bind="{ value: 40, showLabel: true, label: 'Showing a custom label' }" />
		</preview-section>

		<preview-section>
			<template #title>
				Showing the value
			</template>

			<progress-bar v-bind="{ value: 40, showValue: true }" />
		</preview-section>

		<preview-section>
			<template #title>
				Showing both the label and the value
			</template>

			<progress-bar v-bind="{ value: 40, showLabel: true, showValue: true, label: 'Showing a custom label' }" />
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const value = ref(0);

setInterval(() => {
	value.value++;

	if (value.value > 10) {
		value.value = 0;
	}
}, 1e3);
</script>
