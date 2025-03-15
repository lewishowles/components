<template>
	<preview-wrapper>
		<template #title>
			form-textarea
		</template>

		<preview-section>
			<template #title>
				Basic input options
			</template>

			<form-textarea v-model="bio">
				Bio (modelled)
			</form-textarea>

			<pre>Value: {{ bio }}</pre>

			<div>
				<form-textarea ref="focusableInput">
					Focusable
				</form-textarea>

				<ui-button class="button--muted mt-4" @click="triggerFocus">
					Focus
				</ui-button>
			</div>

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
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const bio = ref("");
const focusableInput = ref(null);

function triggerFocus() {
	runComponentMethod(focusableInput.value, "triggerFocus");
}
</script>
