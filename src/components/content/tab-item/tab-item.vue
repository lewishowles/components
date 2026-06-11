<template>
	<div
		v-show="active"
		v-bind="{ id: panelId, 'aria-labelledby': tabId, 'data-active': active || null }"
		tabindex="0"
		role="tabpanel"
		data-component="tab-item"
	>
		<slot v-bind="{ isActive: active }" />
	</div>
</template>

<script setup>
import { computed, inject, onMounted, useId, useSlots } from "vue";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyString } from "@lewishowles/helpers/string";

const props = defineProps({
	/**
	 * Any ID to apply to this tab. This can be used in conjunction with
	 * `tab-group` prop `rememberSelection` to reinstate tabs on page refresh.
	 * When providing an ID, ensure that it is unique.
	 */
	id: {
		type: String,
		default: null,
	},

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

const { registerTab, activeTabId } = inject("tab-group", {});

const slots = useSlots();
// Whether this tab is active.
const active = computed(() => activeTabId?.value === tabId.value);
// The content of the label slot. This is rendered by `tab-group` using `component`.
const label = computed(() => slots.label);
// Stable fallback ID, used when no `id` is provided.
const generatedId = useId();
// The ID of this tab, used to link the panel and the tab together.
const tabId = computed(() => (isNonEmptyString(props.id) ? props.id : `tab-${generatedId}`));
// The ID of the panel associated with this tab.
const panelId = computed(() => `${tabId.value}-panel`);

onMounted(() => {
	if (isFunction(registerTab)) {
		registerTab(
			{
				initiallyActive: props.initiallyActive,
				label,
				tabId,
				panelId,
				icon: props.icon,
			},
			active,
		);
	}

	const hash = window.location.hash.slice(1);

	if (!isNonEmptyString(hash)) {
		return;
	}

	if (
		activeTabId &&
		(hash === tabId.value || document.querySelector(`[id="${panelId.value}"]  #${hash}`))
	) {
		activeTabId.value = tabId.value;
	}
});

/**
 * Activate this tab programmatically.
 */
function select() {
	if (activeTabId) {
		activeTabId.value = tabId.value;
	}
}

defineExpose({ select });
</script>
