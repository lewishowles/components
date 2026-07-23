<template>
	<div
		ref="menuContainerElement"
		class="relative"
		data-component="dropdown-menu"
		:data-state="isOpen ? 'open' : 'closed'"
		data-test="dropdown-menu"
	>
		<ui-button
			v-bind="{
				class: buttonClasses,
				'aria-expanded': isOpen,
				'aria-controls': menuId,
				'aria-haspopup': triggerProps['aria-haspopup'],
			}"
			data-part="trigger"
			data-test="dropdown-menu-trigger"
			@click="toggleMenu"
			@keydown="onTriggerKeydown"
		>
			<slot
				name="summary"
				v-bind="{ open: isOpen, openMenu, closeMenu, toggleMenu, triggerProps }"
			/>
		</ui-button>

		<overlay-sheet
			:class="resolvedSheetClasses"
			v-bind="{
				isOpen,
				isSheet: isNarrow,
				label: sheetLabel,
				closeWithEscape: true,
			}"
			data-test="dropdown-menu-sheet"
			@dismiss="closeAndRestoreFocus"
		>
			<div
				v-if="isOpen"
				ref="menuElement"
				v-bind="{ id: menuId, class: resolvedPanelClasses }"
				:role="isNarrow ? undefined : 'menu'"
				data-part="panel"
				data-test="dropdown-menu-panel"
				@keydown="onMenuKeydown"
			>
				<slot v-bind="{ open: isOpen }" />
			</div>
		</overlay-sheet>
	</div>
</template>

<script setup>
import { computed, nextTick, provide, ref, toRef, useId, useTemplateRef, watch } from "vue";
import { getNextIndex } from "@lewishowles/helpers/array";
import { onClickOutside, onKeyStroke, useFocusWithin, useMediaQuery } from "@vueuse/core";
import { useFloatingPosition } from "@/composables";
import { cn } from "@/utilities/cn.js";

import OverlaySheet from "@/components/messaging/overlay-sheet/overlay-sheet.vue";

const props = defineProps({
	/**
	 * Any classes to add to the trigger button.
	 */
	buttonClasses: {
		type: [String, Array, Object],
		default: "button--muted",
	},

	/**
	 * Additional classes to apply to the dropdown panel, merged on top of the
	 * panel's base styles. Any provided classes that conflict with base classes will override as necessary.
	 */
	detailsClasses: {
		type: [String, Array, Object],
		default: null,
	},

	/**
	 * Whether to open the panel above or below the trigger. The panel flips to
	 * the opposite side if it would clip the viewport edge.
	 */
	placement: {
		type: String,
		default: "below",
	},

	/**
	 * Whether to align the panel to the start or end of the trigger. The panel
	 * flips to the opposite side if it would clip the viewport edge.
	 */
	align: {
		type: String,
		default: "start",
	},
});

const emit = defineEmits(["open", "close"]);

// A unique ID for the menu panel, referenced by aria-controls on the trigger.
const menuId = useId();
// Whether the menu panel is currently open.
const isOpen = ref(false);
// A reference to the outermost container, used for click-outside detection.
const menuContainerElement = useTemplateRef("menuContainerElement");
// A reference to the menu panel, used to query items and handle keyboard events.
const menuElement = useTemplateRef("menuElement");
// Whether focus is currently within the menu panel. Used to decide whether to
// return focus to the trigger when the menu closes.
const { focused: hasFocus } = useFocusWithin(menuElement);
// Whether the action menu should use the narrow modal sheet presentation.
const isNarrow = useMediaQuery("(width < 1024px)");

// Resolves the trigger button DOM element for positioning measurements. Queried
// by data-part rather than a direct ref so it works regardless of what renders
// the trigger (ui-button, custom trigger, etc.).
const triggerDomElement = computed(() =>
	menuContainerElement.value?.querySelector("[data-part='trigger']"),
);

// Derive an accessible label for the narrow action sheet from the trigger text.
const sheetLabel = computed(() => triggerDomElement.value?.textContent?.trim() || "Actions");

const {
	computedPlacement,
	computedAlign,
	isPositioning,
	placementClasses,
	handleOpen: handleFloatingOpen,
	handleClose: handleFloatingClose,
} = useFloatingPosition({
	triggerElement: triggerDomElement,
	panelElement: menuElement,
	initialPlacement: toRef(props, "placement"),
	initialAlign: toRef(props, "align"),
});

// The full class list for the anchored desktop panel, or a simple full-width
// wrapper for the narrow action-sheet content.
const resolvedPanelClasses = computed(() => {
	if (isNarrow.value) {
		return "w-full";
	}

	return cn(
		"absolute animate-fade-in-down animate-fast min-w-3xs py-2 rounded-lg border border-border bg-surface-elevated backdrop-blur-lg z-50",
		placementClasses.value,
		computedPlacement.value === "above" ? "bottom-full" : "top-full",
		computedAlign.value === "end" ? "inset-e-0" : "inset-s-0",
		{ "opacity-0": isPositioning.value },
		props.detailsClasses,
	);
});

// Apply caller panel classes to the sheet itself when the anchored panel is not rendered.
const resolvedSheetClasses = computed(() => (isNarrow.value ? props.detailsClasses : null));

// The ARIA attributes that belong on the trigger element, exposed as a slot
// prop so users building a custom trigger can spread them onto their own element.
const triggerProps = computed(() => ({
	"aria-haspopup": isNarrow.value ? "dialog" : "menu",
	"aria-expanded": isOpen.value,
	"aria-controls": menuId,
}));

// Provide child menu item components with their presentation and selection callback.
provide("dropdown-menu", { isNarrow, selectMenuItem });

// Our type-ahead buffer keeps track of the user's typing while the menu is
// open, enabling us to focus an element whose label matches.
let typeaheadBuffer = "";
let typeaheadTimeout = null;

// Close the menu when clicking outside of the container.
onClickOutside(menuContainerElement, () => {
	if (isNarrow.value || !isOpen.value) {
		return;
	}

	closeMenu();
});

// Close the menu and return focus to the trigger when Escape is pressed.
onKeyStroke("Escape", (event) => {
	if (isNarrow.value || !isOpen.value) {
		return;
	}

	event.preventDefault();
	closeAndRestoreFocus();
});

watch(
	[isOpen, isNarrow],
	async ([open, narrow], [wasOpen, wasNarrow]) => {
		if (!open) {
			handleFloatingClose();

			return;
		}

		if (narrow) {
			if (!wasNarrow && wasOpen) {
				getMenuItems().forEach((item) => item.removeAttribute("tabindex"));

				handleFloatingClose();
			}

			return;
		}

		if (wasNarrow) {
			await nextTick();

			if (isOpen.value && !isNarrow.value) {
				await handleFloatingOpen();
			}
		}
	},
	{ flush: "post" },
);

/**
 * Get all focusable menu items within the panel.
 *
 * @returns  {HTMLElement[]}
 */
function getMenuItems() {
	if (!menuElement.value) {
		return [];
	}

	return Array.from(menuElement.value.querySelectorAll(":is(button, a, summary):not([disabled])"));
}

/**
 * Move focus to a menu item at the given index, updating the roving tabindex so
 * that only the active item is reachable via Tab.
 *
 * @param  {HTMLElement[]}  items
 *     The full list of menu items.
 * @param  {number}  index
 *     The index to focus.
 */
function focusItem(items, index) {
	items.forEach((item) => item.setAttribute("tabindex", "-1"));
	items[index].setAttribute("tabindex", "0");
	items[index].focus();
}

/**
 * Handle type-ahead navigation. Characters typed within 500ms are accumulated
 * into a buffer; the first item whose label starts with the buffer text
 * receives focus.
 *
 * @param  {string}  character
 *     The character just typed.
 * @param  {HTMLElement[]}  items
 *     The full list of menu items.
 */
function handleTypeahead(character, items) {
	clearTimeout(typeaheadTimeout);

	typeaheadBuffer += character.toLowerCase();

	// Find the item that matches
	const match = items.find((item) =>
		item.textContent?.trim().toLowerCase().startsWith(typeaheadBuffer),
	);

	if (match) {
		focusItem(items, items.indexOf(match));
	}

	typeaheadTimeout = setTimeout(() => {
		typeaheadBuffer = "";
	}, 500);
}

/**
 * Handle keydown events on the trigger button. ArrowDown and ArrowUp open the
 * menu and place focus on the first item, matching the ARIA authoring pattern.
 *
 * @param  {KeyboardEvent}  event
 */
function onTriggerKeydown(event) {
	if (isNarrow.value || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) {
		return;
	}

	event.preventDefault();

	openMenu();
}

/**
 * Handle keydown events within the menu panel for keyboard navigation.
 * ArrowDown/ArrowUp move focus; Home/End jump to the ends; printable characters
 * trigger type-ahead; Tab closes the menu so focus flows naturally outward.
 *
 * @param  {KeyboardEvent}  event
 */
function onMenuKeydown(event) {
	if (isNarrow.value) {
		return;
	}

	const items = getMenuItems();

	if (items.length === 0) {
		return;
	}

	const currentIndex = items.findIndex((item) => item === document.activeElement);

	switch (event.key) {
		case "ArrowDown":
			event.preventDefault();

			focusItem(items, getNextIndex(currentIndex, items, { reverse: false, wrap: true }));

			break;
		case "ArrowUp":
			event.preventDefault();

			focusItem(items, getNextIndex(currentIndex, items, { reverse: true, wrap: true }));

			break;
		case "Home":
			event.preventDefault();

			focusItem(items, 0);

			break;
		case "End":
			event.preventDefault();

			focusItem(items, items.length - 1);

			break;
		case "Tab":
			// Allow Tab to close the menu and move focus outside.
			closeMenu();

			break;
		default:
			if (event.key.length === 1) {
				handleTypeahead(event.key, items);
			}
	}
}

/**
 * Toggle the menu open or closed.
 */
function toggleMenu() {
	if (isOpen.value) {
		closeMenu();

		return;
	}

	openMenu();
}

/**
 * Open the menu, resolve panel positioning, then focus the first item.
 */
async function openMenu() {
	isOpen.value = true;

	emit("open");

	if (isNarrow.value) {
		return;
	}

	await handleFloatingOpen();

	const items = getMenuItems();

	if (items.length === 0) {
		return;
	}

	focusItem(items, 0);
}

/**
 * Close the menu.
 */
function closeMenu() {
	isOpen.value = false;

	emit("close");

	handleFloatingClose();
}

/**
 * Close the menu and return focus to the trigger if focus was within the panel.
 */
function closeAndRestoreFocus() {
	const shouldRestoreFocus = isNarrow.value || hasFocus.value;

	closeMenu();

	if (shouldRestoreFocus) {
		menuContainerElement.value?.querySelector("[data-part='trigger']")?.focus();
	}
}

/**
 * Handle selection of a menu item, closing the menu and restoring focus.
 */
function selectMenuItem() {
	closeAndRestoreFocus();
}

defineExpose({
	closeMenu,
	openMenu,
	triggerProps,
});
</script>
