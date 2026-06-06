<template>
	<div class="-mx-16 -mt-16 mb-16 px-[2px] pt-[2px] text-sm">
		<div class="bg-grey-50 dark:bg-grey-950/20 flex justify-end gap-2 rounded-sm p-2">
			<link-tag
				href="https://github.com/lewishowles/components"
				v-bind="{ external: true, showExternalIcon: false }"
				class="button hocus:bg-grey-50z hocus:border-grey-400 hocus:text-grey-700 dark:hocus:bg-white/30 dark:hocus:border-white/20 dark:hocus:text-grey-100 border border-transparent text-current"
			>
				<icon-github class="size-5" />

				<span class="sr-only">View project in GitHub</span>
			</link-tag>

			<floating-details>
				<template #summary>Language mode</template>

				<div class="prose prose-sm dark:prose-invert">
					<h3>Language mode</h3>

					<p>
						There are two language modes available to use in the playground. The default is
						"direct", which means text is added as-is, and the second is "translation", where
						translation strings are used. When using translation, add the prefix to add to any
						examples below, and each will come with a sensible key baked in.
					</p>
				</div>

				<div class="mt-4 flex flex-col gap-4">
					<form-field v-model="useTranslation" type="checkbox" name="language_mode">
						Use "translation" mode.
					</form-field>

					<form-field v-model="translationPathPrefix">
						Translation path prefix

						<template #help>
							Any prefix to add to the translation string paths in examples.
						</template>
					</form-field>
				</div>
			</floating-details>

			<ui-button v-if="!isDark" class="button--muted" icon-start="icon-moon" @click="toggleDark">
				View in dark mode
			</ui-button>

			<ui-button v-if="isDark" class="button--muted" icon-start="icon-sun" @click="toggleDark">
				View in light mode
			</ui-button>
		</div>
	</div>
</template>

<script setup>
import { useDark, useToggle } from "@vueuse/core";
import useTranslationMode from "@/docs/composables/use-translation-mode/use-translation-mode";

const { useTranslation, translationPathPrefix } = useTranslationMode();
const isDark = useDark({ storageKey: "lh:dark" });
const toggleDark = useToggle(isDark);
</script>
