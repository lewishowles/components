<template>
	<div
		v-if="haveTitle || haveIntroduction"
		class="border-border mb-6 border-b pb-6"
		data-test="data-table-header"
	>
		<component :is="headingLevel" v-if="haveTitle" class="text-content-strong text-3xl font-bold">
			<slot name="table-title" />
		</component>

		<div v-if="haveIntroduction" class="text-content-muted text-base">
			<slot name="table-introduction" />
		</div>
	</div>
</template>

<script setup>
import { computed, inject, useSlots } from "vue";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";

const { headingLevel } = inject("data-table", { headingLevel: "h2" });

const slots = useSlots();

// Whether a title has been provided.
const haveTitle = computed(() => isNonEmptySlot(slots["table-title"]));
// Whether an introduction has been provided.
const haveIntroduction = computed(() => isNonEmptySlot(slots["table-introduction"]));
</script>
