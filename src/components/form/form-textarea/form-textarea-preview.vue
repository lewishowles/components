<template>
	<preview-wrapper>
		<template #title>
			form-textarea
		</template>

		<preview-section>
			<template #title>
				Basic input options
			</template>

			<form-layout class="max-w-sm">
				<form-textarea v-model="bio">
					Bio (modelled)
				</form-textarea>

				<pre>Value: {{ bio }}</pre>

				<form-textarea>
					Bio

					<template #help>
						With help text
					</template>
				</form-textarea>

				<form-textarea>
					Bio

					<template #error>
						With an error
					</template>
				</form-textarea>

				<form-textarea>
					Bio

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</form-textarea>

				<form-textarea />
			</form-layout>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const bio = ref("");
</script>
