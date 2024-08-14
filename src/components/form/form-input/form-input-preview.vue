<template>
	<preview-wrapper>
		<template #title>
			form-input
		</template>

		<preview-section>
			<template #title>
				Basic inputs
			</template>

			<form-input>
				Your name
			</form-input>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import PreviewSection from "@/preview/preview-section.vue";
import PreviewWrapper from "@/preview/preview-wrapper.vue";
</script>
