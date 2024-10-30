<template>
	<div data-test="tab-group">
		<nav class="mb-4 border-b border-grey-200 dark:border-grey-700">
			<ol class="-mb-px flex flex-wrap items-end" role="tablist">
				<li v-for="tab in tabs" :key="tab.tabId">
					<button v-bind="{ id: tab.tabId, 'aria-controls': tab.panelId, 'aria-selected': isActiveTab(tab.tabId) }" class="border-b-2 px-4 py-2 hocus:text-grey-950 dark:hocus:text-grey-50" :class="{ 'border-grey-950 text-grey-950 dark:border-grey-50 dark:text-grey-50': isActiveTab(tab.tabId), 'border-transparent': !isActiveTab(tab.tabId) }" data-test="tab-group-tab" @click="setActiveTab(tab.tabId)">
						<component :is="tab.label" />
					</button>
				</li>
			</ol>
		</nav>

		<slot />
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed, provide, ref } from "vue";
import { get } from "@lewishowles/helpers/object";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";

// The list of available tabs, as registered by `tab-item` components.
const tabs = ref([]);

// The IDs of the current tabs, allowing us to easily check for a tab's
// existence.
const tabIds = computed(() => {
	if (!isNonEmptyArray(tabs.value)) {
		return [];
	}

	return tabs.value.reduce((ids, tab) => {
		const tabId = get(tab, "tabId");

		if (isNonEmptyString(tabId)) {
			ids.push(tabId);
		}

		return ids;
	}, []);
});

// The currently active tab by its ID.
const activeTabId = ref(null);

provide("tab-group", {
	registerTab,
	activeTabId,
});

/**
 * Register an individual tab with the group.
 *
 * @param  {object}  tab
 *     The details of the tab to be registered.
 */
function registerTab(tab) {
	tabs.value.push(tab);

	if (tab.initiallyActive === true) {
		activeTabId.value = tab.tabId;

		return;
	}

	ensureActiveTab();
}

/**
 * Ensure that at least one of our tabs is marked active. If none are, we
 * activate the first tab as the default.
 */
function ensureActiveTab() {
	if (isNonEmptyString(activeTabId.value)) {
		if (isValidTabId(activeTabId.value)) {
			return;
		}
	}

	setActiveTabByIndex(0);
}

/**
 * Mark a tab as active at the given index in the tabs array.
 *
 * @param  {number}  index
 *     The index of the tab to activate.
 */
function setActiveTabByIndex(index) {
	if (!isNonEmptyArray(tabs.value)) {
		return;
	}

	const internalIndex = clamp(index, 0, tabs.value.length - 1);
	const tabId = get(tabs.value[internalIndex], "tabId");

	setActiveTab(tabId);
}

/**
 * Mark a tab as active given its ID.
 *
 * @param  {string}  tabId
 *     The ID of the tab to mark as active.
 */
function setActiveTab(tabId) {
	if (!isValidTabId(tabId)) {
		return;
	}

	activeTabId.value = tabId;
}

/**
 * Determine whether the given tab ID is valid - that is, it exists in the list
 * of currently registered tabs.
 *
 * @param  {string}  tabId
 *     The tab ID to test.
 */
function isValidTabId(tabId) {
	if (!isNonEmptyString(tabId)) {
		return false;
	}

	return tabIds.value.includes(tabId);
}

/**
 * Determine whether the given tab ID is the currently active tab.
 *
 * @param  {string}  tabId
 *     The tab ID to check.
 */
function isActiveTab(tabId) {
	return tabId === activeTabId.value;
}
</script>
