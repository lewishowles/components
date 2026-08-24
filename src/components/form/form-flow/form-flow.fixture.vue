<template>
	<form-flow v-model="modelValue" v-bind="{ rules }">
		<form-screen id="account">
			<template #title>Account details</template>
			<form-field name="email">Email address</form-field>
		</form-screen>

		<form-screen id="profile">
			<template #title>Profile details</template>
			<form-field name="displayName">Display name</form-field>
		</form-screen>
	</form-flow>
</template>

<script setup>
import { ref } from "vue";

// The model is shared by both screens throughout the browser journey.
const modelValue = ref({ email: "person@example.com", displayName: "" });

// Each screen owns only the validation rule for its registered field.
const rules = {
	email: [{ rule: "required", message: "Email address is required" }],
	displayName: [{ rule: "required", message: "Display name is required" }],
};
</script>
