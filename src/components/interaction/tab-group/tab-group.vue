<template>
	<div data-test="tab-group">
		<nav ref="tabBarReference" class="mb-4 border-b border-grey-200 dark:border-white/20">
			<ol class="-mb-px flex flex-wrap items-end" role="tablist">
				<li v-for="tab in tabs" :key="tab.tabId">
					<a
						v-bind="{
							'id': tab.tabId,
							'href': `#${tab.panelId}`,
							'aria-controls': tab.panelId,
							'aria-selected': tab.active,
							'tabindex': tab.active ? '1' : '-1',
						}"
						ref="tabAnchors"
						class="inline-block border-b-2 px-4 py-2 no-underline hocus:text-grey-950 dark:hocus:text-white"
						:class="{ 'border-grey-950 text-grey-950 dark:border-white dark:text-white': tab.active, 'border-transparent text-current': !tab.active }"
						data-test="tab-group-tab"
						@click.prevent="setActiveTab(tab.tabId)"
					>
						<component :is="tab.label" />
					</a>
				</li>
			</ol>
		</nav>

		<slot />
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed, provide, ref } from "vue";
import { getNextIndex, isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { onKeyStroke, useFocusWithin } from "@vueuse/core";
import { runComponentMethod } from "@lewishowles/helpers/vue";

// The list of available tabs, as registered by `tab-item` components.
const tabData = ref([]);

// An expansion of the basic tab data to allow each tab to have knowledge of
// whether it is currently the active tab.
const tabs = computed(() => {
	if (!isNonEmptyArray(tabData.value)) {
		return [];
	}

	return tabData.value.map(tab => {
		return {
			active: isActiveTab(tab.tabId),
			...tab,
		};
	});
});

// The list of available tabs, as registered by `tab-item` components.
const tabAnchors = ref([]);
// A reference to our tab bar, containing the tabs within it. This allows us to
// check if any of those tabs currently have focus.
const tabBarReference = ref(null);
// Whether one of our tabs has focus. If so, we allow keyboard navigation of the
// tabs.
const { focused: tabHasFocus } = useFocusWithin(tabBarReference);

// The IDs of the current tabs, allowing us to easily check for a tab's
// existence.
const tabIds = computed(() => {
	if (!isNonEmptyArray(tabs.value)) {
		return [];
	}

	return tabs.value.reduce((ids, tab) => {
		const tabId = tab?.tabId;

		if (isNonEmptyString(tabId)) {
			ids.push(tabId);
		}

		return ids;
	}, []);
});

// The currently active tab by its ID.
const activeTabId = ref(null);
// The index of the currently active tab in the list of tabs.
const activeTabIndex = computed(() => Math.max(0, tabs.value.findIndex(tab => tab.tabId === activeTabId.value)));

provide("tab-group", {
	registerTab,
	activeTabId,
});

/**
 * When using the arrow keys, if a tab is currently focused, navigate forward or
 * backwards through tabs based on the arrow direction.
 */
onKeyStroke(["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"], e => {
	if (!tabHasFocus.value) {
		return;
	}

	e.preventDefault();

	if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
		selectPreviousTab();
	}

	if (["ArrowDown", "ArrowRight"].includes(e.key)) {
		selectNextTab();
	}
});

/**
 * Register an individual tab with the group.
 *
 * @param  {object}  tab
 *     The details of the tab to be registered.
 */
function registerTab(tab) {
	tabData.value.push(tab);

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
	const tabId = tabs.value?.[internalIndex]?.tabId;

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
 * Select the tab before the currently active one, wrapping if necessary.
 *
 * When selecting a tab, we focus the relevant anchor.
 */
function selectPreviousTab() {
	const previousIndex = getNextIndex(activeTabIndex.value, tabs.value, { reverse: true, wrap: true });

	setActiveTabByIndex(previousIndex);
	runComponentMethod(tabAnchors.value[previousIndex], "focus");
}

/**
 * Select the tab after the currently active one, wrapping if necessary.
 *
 * When selecting a tab, we focus the relevant anchor.
 */
function selectNextTab() {
	const nextIndex = getNextIndex(activeTabIndex.value, tabs.value, { reverse: false, wrap: true });

	setActiveTabByIndex(nextIndex);
	runComponentMethod(tabAnchors.value[nextIndex], "focus");
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
