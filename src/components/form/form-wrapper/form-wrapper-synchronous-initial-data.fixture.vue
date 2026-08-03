<template>
	<form-wrapper v-model="formData" v-bind="{ initialData }">
		<form-field v-model="formData.first_name" name="first_name" required>First name</form-field>

		<form-field v-model="formData.last_name" name="last_name" required>Last name</form-field>

		<template #submit-button-label>Save</template>
	</form-wrapper>
</template>

<script setup>
import { ref } from "vue";

// The parent-owned form data.
const formData = ref({});
// The form data available when the wrapper mounts.
const initialData = { first_name: "Alice", last_name: "Example" };
</script>
