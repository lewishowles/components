<template>
	<form-wrapper v-model="formData" v-bind="{ rules }">
		<form-field v-model="fieldValue" v-bind="{ name: fieldName }">
			{{ fieldName === "username" ? "Username" : "Display name" }}
		</form-field>

		<button type="button" data-test="form-field-rename" @click="fieldName = 'displayName'">
			Rename field
		</button>

		<template #submit-button-label>Submit</template>
	</form-wrapper>
</template>

<script setup>
import { ref } from "vue";

// Keep the wrapper model available while the field changes its name.
const formData = ref({});
// Hold the field value separately so the same mounted field can be renamed.
const fieldValue = ref(null);
// Change the field name without replacing the component.
const fieldName = ref("username");

// Require both names so a stale username registration would create a second error.
const rules = {
	username: [{ rule: "required", message: "Enter username" }],
	displayName: [{ rule: "required", message: "Enter display name" }],
};
</script>
