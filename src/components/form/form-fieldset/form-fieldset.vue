<template>
	<div data-test="form-fieldset">
		<div class="mb-6 flex flex-col gap-4 border-b border-grey-200 pb-6">
			<component :is="headingLevel" class="text-3xl font-bold text-grey-950">
				<slot name="title" />
			</component>

			<slot name="introduction" />
		</div>

		<form-layout>
			<slot />
		</form-layout>
	</div>
</template>

<script setup>
defineProps({
	/**
	 * The heading level to use for this fieldset.
	 */
	headingLevel: {
		type: String,
		default: "h2",
	},
});
</script>
