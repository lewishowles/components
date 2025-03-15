<template>
	<preview-wrapper>
		<template #title>
			form-date
		</template>

		<preview-section>
			<template #title>
				Basic field options
			</template>

			<form-date v-model="emptyDate">
				When did you first request help?
			</form-date>

			<pre>{{ emptyDate }}</pre>

			<form-date v-model="filledDate">
				When did you first request help?
			</form-date>

			<pre>{{ filledDate }}</pre>

			<form-date>
				When did you first request help?

				<template #help>
					With help text
				</template>
			</form-date>

			<form-date>
				When did you first request help?

				<template #error>
					With an error
				</template>
			</form-date>

			<form-date>
				When did you first request help?

				<template #help>
					With help text
				</template>

				<template #error>
					With an error
				</template>
			</form-date>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";

const emptyDate = ref(null);
const filledDate = ref({ day: "25", month: "5", year: "1986" });
</script>
