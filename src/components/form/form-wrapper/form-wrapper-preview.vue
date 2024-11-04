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
				<form-field type="text" name="username">
					Username
				</form-field>

				<form-field type="password" name="password">
					Password
				</form-field>
			</form-wrapper>

			<pre>{{ formData }}</pre>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({});
</script>
