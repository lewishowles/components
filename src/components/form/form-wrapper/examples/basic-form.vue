<template>
	<form-wrapper v-model="formData" @submit="saveProfile">
		<form-field name="name" v-bind="{ validation: validation.name }">
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
				validation: validation.email,
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

// Validation rules run by form-wrapper before submit.
const validation = {
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
