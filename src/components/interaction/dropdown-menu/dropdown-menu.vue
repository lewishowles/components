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
			}"
			aria-haspopup="menu"
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

		<div
			v-if="isOpen"
			v-bind="{
				id: menuId,
				class: [
					detailsClasses,
					placementClasses,
					computedPlacement === 'above' ? 'bottom-full' : 'top-full',
					computedAlign === 'end' ? 'inset-e-0' : 'inset-s-0',
					{ 'opacity-0': isPositioning },
				],
			}"
			ref="menuElement"
			role="menu"
			class="absolute"
			data-part="panel"
			data-test="dropdown-menu-panel"
			@keydown="onMenuKeydown"
		>
			<slot v-bind="{ open: isOpen }" />
		</div>
	</div>
</template>

<script setup>
import { computed, provide, ref, toRef, useId, useTemplateRef } from "vue";
import { getNextIndex } from "@lewishowles/helpers/array";
import { onClickOutside, onKeyStroke, useFocusWithin } from "@vueuse/core";
import { useFloatingPosition } from "@/composables";

const props = defineProps({
	/**
	 * Any classes to add to the trigger button.
	 */
	buttonClasses: {
		type: [String, Array, Object],
		default: "button--muted",
	},

	/**
	 * Any classes to add to the dropdown panel.
	 */
	detailsClasses: {
		type: [String, Array, Object],
		default:
			"animate-fade-in-down animate-fast min-w-3xs py-2 rounded-lg border border-grey-300 bg-white dark:border-white/20 dark:bg-grey-950/20 backdrop-blur-lg z-50",
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

// Resolves the trigger button DOM element for positioning measurements. Queried
// by data-part rather than a direct ref so it works regardless of what renders
// the trigger (ui-button, custom trigger, etc.).
const triggerDomElement = computed(() =>
	menuContainerElement.value?.querySelector("[data-part='trigger']"),
);

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

// The ARIA attributes that belong on the trigger element, exposed as a slot
// prop so users building a custom trigger can spread them onto their own element.
const triggerProps = computed(() => ({
	"aria-haspopup": "menu",
	"aria-expanded": isOpen.value,
	"aria-controls": menuId,
}));

// Provide child menu item components with a way to close the menu on selection.
provide("dropdown-menu", { selectMenuItem });

// Our type-ahead buffer keeps track of the user's typing while the menu is
// open, enabling us to focus an element whose label matches.
let typeaheadBuffer = "";
let typeaheadTimeout = null;

// Close the menu when clicking outside of the container.
onClickOutside(menuContainerElement, () => {
	if (!isOpen.value) {
		return;
	}

	closeMenu();
});

// Close the menu and return focus to the trigger when Escape is pressed.
onKeyStroke("Escape", (event) => {
	if (!isOpen.value) {
		return;
	}

	event.preventDefault();
	closeAndRestoreFocus();
});

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
	if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
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
	if (hasFocus.value) {
		menuContainerElement.value?.querySelector("[data-part='trigger']")?.focus();
	}

	closeMenu();
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
