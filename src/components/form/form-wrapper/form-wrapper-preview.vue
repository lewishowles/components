<template>
	<preview-wrapper>
		<template #title>
			form-wrapper
		</template>

		<preview-section>
			<template #title>
				Modelled form
			</template>

			<form-wrapper v-model="formData" @submit="submitted = true">
				<form-field type="email" name="email">
					Email address
				</form-field>

				<form-field type="password" name="password">
					Password
				</form-field>

				<template #submit-button-label>
					Test submit
				</template>
			</form-wrapper>

			<pre class="mt-4">{{ formData }}</pre>
			<pre>{{ { submitted } }}</pre>
		</preview-section>

		<preview-section>
			<template #title>
				With validation
			</template>

			<form-wrapper>
				<form-field type="text" name="required_test" :validation="[{ rule: 'required', message: 'Please enter your name' }]">
					Your name
				</form-field>

				<template #submit-button-label>
					Test submit
				</template>
			</form-wrapper>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({});
const submitted = ref(false);
</script>
