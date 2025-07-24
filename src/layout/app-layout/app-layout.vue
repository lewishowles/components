<template>
	<div class="flex min-h-screen">
		<div class="sr-only" aria-live="polite">
			{{ title }}
		</div>

		<app-sidebar class="shrink-0 min-w-80" />

		<div class="grow py-2 pe-2">
			<div class="rounded-md border border-grey-200 bg-white p-16 min-h-full dark:border-transparent dark:bg-grey-950/20">
				<div class="pt-[2px] px-[2px] -mt-16 -mx-16 mb-16 text-sm">
					<div class="p-2 bg-grey-50 dark:bg-grey-950/20 rounded-sm flex gap-2 justify-end">
						<link-tag href="https://github.com/lewishowles/components" v-bind="{ external: true, showExternalIcon: false }" class="px-2 text-current rounded-lg border border-transparent hocus:bg-grey-50z hocus:border-grey-400 hocus:text-grey-700 dark:hocus:bg-white/30 dark:hocus:border-white/20 dark:hocus:text-grey-100">
							<icon-github class="size-5" />

							<span class="sr-only">View project in GitHub</span>
						</link-tag>

						<floating-details>
							<template #summary>
								Language mode
							</template>

							<div class="prose prose-sm dark:prose-invert">
								<h3>Language mode</h3>

								<p>
									There are two language modes available to use in the playground. The default is "direct", which means text is added as-is, and the second is "translation", where translation strings are used. When using translation, add the prefix to add to any examples below, and each will come with a sensible key baked in.
								</p>
							</div>

							<div class="flex flex-col gap-4 mt-4">
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

				<div id="content">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
/**
 * The main layout for the Components showcase, `app-layout` encapsulates the
 * base functionality for viewing each component.
 */
import { useDark, useToggle } from "@vueuse/core";
import useTitle from "@/composables/use-title/use-title";
import useTranslationMode from "@/composables/use-translation-mode/use-translation-mode";

import AppSidebar from "@/layout/app-sidebar/app-sidebar.vue";

const { title } = useTitle();
const { useTranslation, translationPathPrefix } = useTranslationMode();
const isDark = useDark({ storageKey: "lh:dark" });
const toggleDark = useToggle(isDark);
</script>
