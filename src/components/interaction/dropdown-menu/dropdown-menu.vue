<template>
	<summary-details ref="summaryDetailsComponent" v-bind="{ floating: true, closeWithClickOutside: true, summaryClasses, detailsClasses }" @open="emit('open')" @close="emit('close')">
		<template #summary="{ open, icon }">
			<slot name="summary" v-bind="{ open, icon }" />
		</template>

		<template #default="{ open, icon }">
			<slot name="default" v-bind="{ open, icon }" />
		</template>
	</summary-details>
</template>

<script setup>
import { ref } from "vue";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const emit = defineEmits(["open", "close"]);

// A reference to the original summary-details element, allowing us to pass
// data.
const summaryDetailsComponent = ref(null);
// Default styling for our summary. This is overridden if the user provides
// their own summaryClasses prop.
const summaryClasses = "button--muted";
// Default styling for our dropdown. This is overridden if the user provides
// their own detailsClasses prop.
const detailsClasses = "animate-fade-in-down animate-fast mt-2 min-w-3xs rounded-lg border-grey-200 bg-white dark:border-transparent dark:bg-grey-950/20 backdrop-blur-lg";

/**
 * Open the menu.
 */
function openMenu() {
	runComponentMethod(summaryDetailsComponent.value, "openDetails");
}

/**
 * Close the menu.
 */
function closeMenu() {
	runComponentMethod(summaryDetailsComponent.value, "closeDetails");
}

defineExpose({
	openMenu,
	closeMenu,
});
</script>
