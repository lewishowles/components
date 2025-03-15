<template>
	<preview-wrapper>
		<template #title>
			star-rating
		</template>

		<preview-section>
			<template #title>
				Basic options
			</template>

			<form-layout>
				<star-rating v-model="model">
					Rate your experience
				</star-rating>

				<pre>{{ model }}</pre>

				<div>
					<star-rating ref="focusableRadio">
						Focusable
					</star-rating>

					<ui-button class="button--muted mt-4" @click="triggerFocus">
						Focus
					</ui-button>
				</div>

				<star-rating>
					Rate your experience

					<template #help>
						With help text
					</template>
				</star-rating>

				<star-rating>
					Rate your experience

					<template #error>
						With an error
					</template>
				</star-rating>

				<star-rating>
					Rate your experience

					<template #help>
						With help text
					</template>

					<template #error>
						With an error
					</template>
				</star-rating>
			</form-layout>
		</preview-section>

		<preview-section>
			<template #title>
				With introduction
			</template>

			<star-rating>
				Rate your experience

				<template #introduction>
					You will be judged based on your answer.
				</template>
			</star-rating>
		</preview-section>
	</preview-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const model = ref(null);
const focusableRadio = ref(null);

function triggerFocus() {
	runComponentMethod(focusableRadio.value, "triggerFocus");
}
</script>
