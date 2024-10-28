<template>
	<preview-wrapper>
		<template #title>
			form-checkbox
		</template>

		<preview-section>
			<template #title>
				Basic input options
			</template>

			<form-layout class="max-w-sm">
				<form-checkbox v-model="checked">
					Accept terms (modelled)
				</form-checkbox>

				<pre>Value: {{ checked }}</pre>

				<form-checkbox>
					Accept terms

					<template #help>
						With help text
					</template>
				</form-checkbox>

				<form-checkbox>
					Accept terms

					<template #error>
						With an error
					</template>
				</form-checkbox>

				<form-checkbox>
					Accept terms

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</form-checkbox>

				<form-checkbox />
			</form-layout>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const checked = ref(false);
</script>
