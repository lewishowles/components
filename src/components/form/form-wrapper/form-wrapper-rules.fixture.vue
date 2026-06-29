<template>
	<form-wrapper v-bind="{ rules }">
		<form-field
			v-bind="{
				name: 'password',
				type: 'password',
			}"
		>
			Password
		</form-field>

		<form-field
			v-bind="{
				name: 'confirmPassword',
				type: 'password',
			}"
		>
			Confirm password
		</form-field>

		<template #submit-button-label>Create user</template>
	</form-wrapper>
</template>

<script setup>
// All validation lives on form-wrapper, keyed by field name. Rules use only
// plain objects (no functions), so they survive the mount helper's deepMerge.
// The `same` rule expresses a constraint neither field can validate on its own.
const rules = {
	password: [{ rule: "required", message: "Enter a password" }],
	confirmPassword: [
		{ rule: "required", message: "Confirm your password" },
		{ rule: "same", field: "password", message: "Passwords must match" },
	],
};
</script>
