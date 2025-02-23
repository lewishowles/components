<template>
	<preview-wrapper>
		<template #title>
			form-date
		</template>

		<preview-section>
			<template #title>
				Empty date
			</template>

			<form-date v-model="emptyDate" />

			<pre>{{ emptyDate }}</pre>
		</preview-section>

		<preview-section>
			<template #title>
				Empty date
			</template>

			<form-date v-model="filledDate" />

			<pre>{{ filledDate }}</pre>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const emptyDate = ref(null);
const filledDate = ref({ day: "25", month: "5", year: "1986" });
</script>
