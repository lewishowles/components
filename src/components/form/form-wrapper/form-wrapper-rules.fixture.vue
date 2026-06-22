<template>
	<form-wrapper v-bind="{ rules }">
		<form-field
			v-bind="{
				name: 'password',
				type: 'password',
				validation: [{ rule: 'required', message: 'Enter a password' }],
			}"
		>
			Password
		</form-field>

		<form-field
			v-bind="{
				name: 'confirmPassword',
				type: 'password',
				validation: [{ rule: 'required', message: 'Confirm your password' }],
			}"
		>
			Confirm password
		</form-field>

		<template #submit-button-label>Create user</template>
	</form-wrapper>
</template>

<script setup>
// Cross-field rules use only plain objects (no functions), so they survive the
// mount helper's deepMerge. The `same` rule expresses a constraint neither field
// can validate on its own.
const rules = {
	confirmPassword: [{ rule: "same", field: "password", message: "Passwords must match" }],
};
</script>
