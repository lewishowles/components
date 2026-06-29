<template>
	<form-wrapper v-bind="{ rules }">
		<form-field v-bind="{ name: 'username' }">Username</form-field>

		<template #submit-button-label>Create user</template>
	</form-wrapper>
</template>

<script setup>
// Validation lives on form-wrapper, keyed by field name.
const rules = {
	username: [{ rule: "required", message: "Enter your username" }],
};
</script>
