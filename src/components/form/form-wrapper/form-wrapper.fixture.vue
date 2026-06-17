<template>
	<form-wrapper>
		<form-field
			v-bind="{
				name: 'username',
				validation: [{ rule: 'required', message: 'Enter your username' }],
			}"
		>
			Username
		</form-field>

		<template #submit-button-label>Create user</template>
	</form-wrapper>
</template>
