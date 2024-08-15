<template>
	<preview-wrapper>
		<template #title>
			form-input
		</template>

		<preview-section>
			<template #title>
				Basic inputs
			</template>

			<form-layout>
				<form-input>
					Your name
				</form-input>

				<form-input>
					Your name

					<template #help>
						With help text
					</template>
				</form-input>

				<form-input>
					Your name

					<template #error>
						With an error
					</template>
				</form-input>

				<form-input>
					Your name

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</form-input>

				<form-input />
			</form-layout>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import PreviewSection from "@/preview/preview-section.vue";
import PreviewWrapper from "@/preview/preview-wrapper.vue";
import FormLayout from "@/components/form/form-layout/form-layout.vue";
</script>
