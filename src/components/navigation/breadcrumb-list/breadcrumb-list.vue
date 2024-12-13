<template>
	<alert-message v-if="!haveLabel" type="error">
		<template #title>
			&lt;breadcrumb-list&gt;
		</template>

		A `label` is required for accessibility purposes.
	</alert-message>

	<nav v-else :aria-label="label" data-test="breadcrumb-list">
		<ol class="flex items-center gap-2" data-test="breadcrumb-list-list">
			<slot />
		</ol>
	</nav>
</template>

<script setup>
import { computed } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	// i18n

	/**
	 * The label for the breadcrumbs, intended to explain to screen reader users
	 * the purpose of the navigation.
	 */
	label: {
		type: String,
		default: "Breadcrumb",
	},
});

// Whether a label for the pagination has been provided.
const haveLabel = computed(() => isNonEmptyString(props.label));
</script>
