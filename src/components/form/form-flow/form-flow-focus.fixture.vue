<!-- This fixture exercises focus behaviour when navigating between form-flow screens. -->
<template>
	<div>
		<form-flow v-model="modelValue" v-bind="{ rules }">
			<form-screen id="first">
				<template #title>First details</template>
				<form-field name="first">First answer</form-field>
			</form-screen>

			<form-screen id="second" auto-focus="second">
				<template #title>Second details</template>
				<!-- Pushes the field off-screen so a scroll-to-field test has something to assert. -->
				<div data-test="form-flow-focus-spacer" style="block-size: 150vh" />
				<form-field name="second">Second answer</form-field>
			</form-screen>
		</form-flow>
	</div>
</template>

<script setup>
import { ref } from "vue";

// The shared form model used by both screens.
const modelValue = ref({ first: "ready", second: "ready" });

// Each screen owns validation for its registered field.
const rules = {
	first: [{ rule: "required", message: "First answer is required" }],
	second: [{ rule: "required", message: "Second answer is required" }],
};
</script>
