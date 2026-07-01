<template>
	<form-wrapper v-model="formData" v-bind="{ compact: true, rules }" @submit="saveSettings">
		<form-fieldset>
			<template #title>Personal details</template>
			<template #introduction>Basic information used to identify your account.</template>

			<form-field name="name">Full name</form-field>

			<form-field name="email" type="email">Email address</form-field>
		</form-fieldset>

		<form-fieldset>
			<template #title>Preferences</template>

			<form-field
				name="language"
				type="select"
				v-bind="{
					options: [
						{ value: 'en', label: 'English' },
						{ value: 'fr', label: 'French' },
						{ value: 'de', label: 'German' },
					],
				}"
			>
				Language
			</form-field>
		</form-fieldset>

		<template #submit-button-label>Save settings</template>
	</form-wrapper>
</template>

<script setup>
const formData = defineModel({ default: () => ({}) });

const rules = {
	name: [{ rule: "required", message: "Enter your full name." }],
	email: [{ rule: "required", message: "Enter your email address." }],
};

function saveSettings(values) {
	void values;
}
</script>
