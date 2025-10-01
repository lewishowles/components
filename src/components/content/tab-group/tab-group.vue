<template>
	<div data-test="tab-group">
		<nav ref="tabBarReference" class="mb-12 border-b border-grey-200 dark:border-white/20" :class="{ 'wrap-tabs': wrap }" data-selector="tab-group-nav">
			<ol class="-mb-px flex items-end" :class="{ 'overflow-x-auto': !wrap, 'flex-wrap': wrap }" role="tablist">
				<li v-for="tab in tabs" :key="tab.tabId">
					<link-tag
						v-bind="{
							'id': tab.tabId,
							'href': `#${tab.panelId}`,
							'aria-controls': tab.panelId,
							'aria-selected': tab.active,
							'tabindex': tab.active ? '1' : '-1',
							'icon-start': tab.icon,
						}"
						ref="tabAnchors"
						class="border-b-2 px-4 py-2 no-underline whitespace-nowrap"
						:class="{
							'border-purple-800 text-purple-800 dark:border-white dark:text-white': tab.active,
							'border-transparent text-current hocus:border-grey-500 hocus:text-grey-950 dark:hocus:border-white/60 dark:hocus:text-white': !tab.active,
						}"
						data-test="tab-group-tab"
						@click.prevent="setActiveTabById(tab.tabId)"
					>
						<component :is="tab.label" />
					</link-tag>
				</li>
			</ol>
		</nav>

		<slot />
	</div>
</template>

<script setup>
import { clamp } from "@lewishowles/helpers/number";
import { computed, nextTick, onMounted, provide, ref } from "vue";
import { getNextIndex, isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { onKeyStroke, useFocusWithin } from "@vueuse/core";
import { runComponentMethod } from "@lewishowles/helpers/vue";

const props = defineProps({
	/**
	 * Whether to remember the selected tab, updating the URL and allowing the
	 * appropriate tab to be reinstated on load. Note that when using this
	 * feature, tabs must be given custom IDs, as opposed to the default IDs,
	 * which are randomly generated.
	 */
	rememberSelection: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to wrap tabs, or display them in a single line with overflow
	 * indicators (default).
	 */
	wrap: {
		type: Boolean,
		default: false,
	},
});

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

// When mounting, apply a little Javascript to our tabs to conditionally show
// the overflow indicators.
onMounted(() => {
	setUpScrollIndicators();
});

/**
 * Register an individual tab with the group.
 *
 * @param  {object}  tab
 *     The details of the tab to be registered.
 */
function registerTab(tab) {
	if (tabData.value.find(existingTab => existingTab.tabId === tab.tabId) !== undefined) {
		return;
	}

	tabData.value.push(tab);

	if (tab.initiallyActive === true) {
		activeTabId.value = tab.tabId;

		return;
	}

	// Ensure we have an active tab.
	ensureActiveTab();
	// Ensure we update our indicators to accommodate this new tab.
	updateIndicators();
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

	setActiveTabByIndex(0, { rememberSelection: false });
}

/**
 * Mark a tab as active at the given index in the tabs array.
 *
 * @param  {number}  index
 *     The index of the tab to activate.
 * @param  {object}  options
 *     Additional options when setting the active tab.
 * @param  {boolean}  rememberSelection
 *     Whether to update the URL for this change. We don't want to do this when
 *     setting the default tab to active, for example.
 */
function setActiveTabByIndex(index, { rememberSelection = true } = {}) {
	if (!isNonEmptyArray(tabs.value)) {
		return;
	}

	const internalIndex = clamp(index, 0, tabs.value.length - 1);
	const tabId = tabs.value?.[internalIndex]?.tabId;

	setActiveTabById(tabId, { rememberSelection });
}

/**
 * Mark a tab as active given its ID.
 *
 * @param  {string}  tabId
 *     The ID of the tab to mark as active.
 * @param  {object}  options
 *     Additional options when setting the active tab.
 * @param  {boolean}  rememberSelection
 *     Whether to update the URL for this change. We don't want to do this when
 *     setting the default tab to active, for example.
 */
function setActiveTabById(tabId, { rememberSelection = true } = {}) {
	if (!isValidTabId(tabId)) {
		return;
	}

	activeTabId.value = tabId;

	if (rememberSelection === true && props.rememberSelection === true && window.location.hash.slice(1) !== tabId) {
		window.history.pushState(null, null, `#${tabId}`);
	}
}

/**
 * Select the tab before the currently active one, wrapping if necessary.
 *
 * When selecting a tab, we focus the relevant anchor.
 */
function selectPreviousTab() {
	const previousIndex = getNextIndex(activeTabIndex.value, tabs.value, { reverse: true, wrap: true });

	setActiveTabByIndex(previousIndex);
	focusTabByIndex(previousIndex);
}

/**
 * Select the tab after the currently active one, wrapping if necessary.
 *
 * When selecting a tab, we focus the relevant anchor.
 */
function selectNextTab() {
	const nextIndex = getNextIndex(activeTabIndex.value, tabs.value, { reverse: false, wrap: true });

	setActiveTabByIndex(nextIndex);
	focusTabByIndex(nextIndex);
}

/**
 * Focus a given tab to provide visual feedback to keyboard users.
 *
 * @param  {number}  index
 *     The index of the tab to focus.
 */
async function focusTabByIndex(tabIndex) {
	if (tabIndex < 0 || tabIndex >= tabAnchors.value.length) {
		return;
	}

	await nextTick();

	runComponentMethod(tabAnchors.value[tabIndex], "triggerFocus");
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

/**
 * Set up scroll indicators and monitor for changes in both the scroll position
 * and the window size.
 */
async function setUpScrollIndicators() {
	const nav = tabBarReference.value;

	if (!nav) {
		return;
	}

	const ol = nav.querySelector("ol");

	ol.addEventListener("scroll", updateIndicators);

	window.addEventListener("resize", updateIndicators);

	await nextTick();

	updateIndicators();
}

/**
 * Update current scroll indicators.
 */
function updateIndicators() {
	const nav = tabBarReference.value;

	if (!nav) {
		return;
	}

	const ol = nav.querySelector("ol");

	const scrollLeft = ol.scrollLeft;
	const maxScroll = ol.scrollWidth - ol.clientWidth;

	nav.classList.toggle("show-left", scrollLeft > 0);
	nav.classList.toggle("show-right", scrollLeft < maxScroll);
}
</script>

<style>
[data-selector="tab-group-nav"] {
	position:relative;
}

[data-selector="tab-group-nav"] {
	&::before, &::after {
		content: "";
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 30px;
		pointer-events: none;
		z-index: 1;
	}
}

[data-selector="tab-group-nav"] {
	&.show-left::before, &.show-right::after {
		display: block;
	}
}

[data-selector="tab-group-nav"].wrap-tabs {
	&::before, &::after {
		display: none;
	}
}

[data-selector="tab-group-nav"]::before {
	background: linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
	left: 0;
}

[data-selector="tab-group-nav"]:where(.dark, .dark *)::before {
	background: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
}

[data-selector="tab-group-nav"]::after {
	background: linear-gradient(to left, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
	right: 0;
}

[data-selector="tab-group-nav"]:where(.dark, .dark *)::after {
	background: linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
	right: 0;
}
</style>
