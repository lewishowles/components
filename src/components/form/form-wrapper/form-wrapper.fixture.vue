<template>
	<form-wrapper v-model="formData" v-bind="{ rules }">
		<form-field v-model="formData.username" v-bind="{ name: 'username' }">Username</form-field>

		<template #submit-button-label>Create user</template>
	</form-wrapper>
</template>

<script setup>
const formData = defineModel({ default: () => ({}) });

// Validation lives on form-wrapper, keyed by field name.
const rules = {
	username: [{ rule: "required", message: "Enter your username" }],
};
</script>
