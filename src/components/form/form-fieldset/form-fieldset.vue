<template>
	<div data-test="form-fieldset">
		<div class="border-grey-200 mb-6 flex flex-col gap-4 border-b pb-6">
			<component :is="headingLevel" class="text-grey-950 dark:text-grey-50 text-3xl font-bold">
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
