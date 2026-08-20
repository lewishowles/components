<template>
	<form-wrapper v-model="formData" v-bind="{ rules }">
		<form-field v-if="showUsername" v-model="formData.username" v-bind="{ name: 'username' }">
			Username
		</form-field>

		<form-field v-model="formData.email" v-bind="{ name: 'email' }">Email</form-field>

		<button type="button" data-test="form-field-remove-username" @click="showUsername = false">
			Remove username
		</button>

		<template #submit-button-label>Submit</template>
	</form-wrapper>
</template>

<script setup>
import { ref } from "vue";

// Keep the wrapper model available while the username field is removed.
const formData = ref({});
// Control whether the username field is mounted.
const showUsername = ref(true);

// Require both fields so a stale username registration would create a second error.
const rules = {
	username: [{ rule: "required", message: "Enter username" }],
	email: [{ rule: "required", message: "Enter email" }],
};
</script>
