<template>
	<div v-show="active" v-bind="{ id: panelId, 'aria-labelledby': tabId }" role="tabpanel">
		<div class="hidden" aria-hidden="true">
			<slot name="label" />
		</div>

		<slot />
	</div>
</template>

<script setup>
import { computed, inject, onMounted, useSlots } from "vue";
import { nanoid } from "nanoid";

const props = defineProps({
	/**
	 * Whether this tab is initially active.
	 */
	initiallyActive: {
		type: Boolean,
		default: false,
	},

	/**
	 * An icon to display with the tab button.
	 */
	icon: {
		type: String,
		default: null,
	},
});

const { registerTab, activeTabId } = inject("tab-group");

const slots = useSlots();
// Whether this tab is active.
const active = computed(() => activeTabId.value === tabId.value);
// The content of the label slot. This is rendered by `tab-group` using
// `component`.
const label = computed(() => slots.label);
// The ID of this tab, used to link the panel and the tab together.
const tabId = computed(() => nanoid());
// The ID of this tab, used to link the panel and the tab together.
const panelId = computed(() => `${tabId.value}-panel`);

onMounted(() => {
	// Register our tab with the parent group.
	registerTab({
		initiallyActive: props.initiallyActive,
		label,
		tabId,
		panelId,
		icon: props.icon,
	}, active);
});
</script>
