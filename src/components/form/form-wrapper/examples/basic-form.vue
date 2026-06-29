<template>
	<form-wrapper v-model="formData" v-bind="{ rules }" @submit="saveProfile">
		<form-field name="name">
			Full name

			<template #help>Use the name you want shown on your account.</template>
		</form-field>

		<form-field
			name="email"
			type="email"
			v-bind="{
				inputAttributes: {
					autocomplete: 'email',
				},
			}"
		>
			Email address
		</form-field>

		<template #submit-button-label>Save profile</template>
	</form-wrapper>
</template>

<script setup>
// Current form values, exposed via v-model so a parent can observe submitted data.
const formData = defineModel({ default: () => ({}) });

// Form-level validation rules, keyed by field name, run by form-wrapper before submit.
const rules = {
	name: [{ rule: "required", message: "Enter your full name." }],
	email: [{ rule: "required", message: "Enter your email address." }],
};

/**
 * Save valid profile data.
 *
 * @param  {object}  values
 *     Submitted form values.
 */
function saveProfile(values) {
	void values;
	// Submit values to your API here.
}
</script>
