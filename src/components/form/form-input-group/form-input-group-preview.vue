<template>
	<preview-wrapper>
		<template #title>
			radio-group
		</template>

		<preview-section>
			<template #title>
				Basic radio options
			</template>

			<form-input-group v-model="radioModel" v-bind="{ type: 'radio', options }">
				`type="radio"`
			</form-input-group>

			<pre>{{ radioModel }}</pre>

			<form-input-group v-model="checkboxModel" v-bind="{ type: 'checkbox', options }">
				`type="checkbox"`
			</form-input-group>

			<pre>{{ checkboxModel }}</pre>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const options = [{ label: "Chocolate", value: "chocolate" }, { label: "Vanilla", value: "vanilla" }, { label: "Strawberry", value: "strawberry" }];
const radioModel = ref({});
const checkboxModel = ref({});
</script>
