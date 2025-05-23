<template>
	<tab-item class="pt-8">
		<template #label>
			<slot name="title" />
		</template>

		<div class="prose dark:prose-invert *:animate-fade-in *:delay">
			<h2><slot name="title" /></h2>

			<slot name="post-title" />

			<ol v-if="haveSections">
				<li v-for="section in sections" :key="section.id">
					<a :href="`#${section.id}`">{{ section.title }}</a>
				</li>
			</ol>

			<slot />
		</div>

		<slot name="post-content" />
	</tab-item>
</template>

<script setup>
import { computed, provide, ref } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";

// Any sections that are contained in this tab, which are used to populate the
// table of contents.
const sections = ref([]);
// Whether any sections are present.
const haveSections = computed(() => isNonEmptyArray(sections.value));

provide("component-tab", {
	registerSection,
});

/**
 * Register a section, which can then be used in the table of contents.
 *
 * @param  {object}  options
 *     Additional options
 * @param  {string}  options.id
 *     The ID of the section
 * @param  {string}  options.title
 *     The title of the section
 */
function registerSection({ id, title }) {
	if (!isNonEmptyString(id) || !isNonEmptyString(title)) {
		return;
	}

	sections.value.push({ id, title });
}
</script>
