<template>
	<preview-wrapper>
		<template #title>
			form-input
		</template>

		<preview-section>
			<template #title>
				Basic input options
			</template>

			<form-layout class="max-w-sm">
				<form-input v-model="name">
					Your name (modelled)
				</form-input>

				<pre>Value: {{ name }}</pre>

				<div>
					<form-input ref="focusableInput">
						Focusable
					</form-input>

					<ui-button class="button--muted mt-4" @click="triggerFocus">
						Focus
					</ui-button>
				</div>

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

		<preview-section>
			<template #title>
				With decoration
			</template>

			<form-layout class="max-w-sm">
				<form-input>
					Prefix icon

					<template #prefix>
						<icon-user />
					</template>

					<template #help>
						With help text
					</template>
				</form-input>

				<form-input>
					Suffix icon

					<template #suffix>
						<icon-email />
					</template>

					<template #help>
						With help text
					</template>
				</form-input>

				<form-input>
					Prefix text

					<template #prefix>
						https://
					</template>

					<template #help>
						With help text
					</template>
				</form-input>

				<form-input>
					Suffix text

					<template #suffix>
						mph
					</template>

					<template #help>
						With help text
					</template>
				</form-input>
			</form-layout>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const name = ref("");
const focusableInput = ref(null);

function triggerFocus() {
	runComponentMethod(focusableInput.value, "triggerFocus");
}
</script>
