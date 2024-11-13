<template>
	<preview-wrapper>
		<template #title>
			form-wrapper
		</template>

		<preview-section>
			<template #title>
				Modelled form
			</template>

			<form-wrapper v-model="formData">
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
		</preview-section>

		<preview-section>
			<template #title>
				With validation
			</template>

			<form-wrapper @submit="submitted = true">
				<form-field type="text" name="required_test" v-bind="{ validation }">
					Your name
				</form-field>

				<template #submit-button-label>
					Test submit
				</template>
			</form-wrapper>

			<pre class="mt-4">{{ { submitted } }}</pre>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({});
const submitted = ref(false);

const validation = [
	{ rule: "minimum_length", length: 5, message: "Your name must be at least 5 characters long" },
	{ rule: "maximum_length", length: 3, message: "Your name can't be more than 3 characters long" },
];
</script>
