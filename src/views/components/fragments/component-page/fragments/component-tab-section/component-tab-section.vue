<template>
	<prop-title v-bind="{ id }">
		<template #title>
			<slot name="title" />
		</template>

		<template #type>
			<slot name="type" />
		</template>

		<template #default-value>
			<slot name="default-value" />
		</template>
	</prop-title>

	<slot />
</template>

<script setup>
import { computed, inject, useSlots } from "vue";
import { getSlotText } from "@lewishowles/helpers/vue";

import PropTitle from "../prop-title/prop-title.vue";

const props = defineProps({
	/**
	 * The ID of this section, allow it to be linked to.
	 */
	id: {
		type: String,
		default: null,
	},

});

const { registerSection } = inject("component-tab");
const slots = useSlots();
// The text contained in our title slot.
const titleText = computed(() => getSlotText(slots.title));

registerSection({ id: props.id, title: titleText.value });
</script>
