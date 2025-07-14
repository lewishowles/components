import { isNonEmptyObject } from "@lewishowles/helpers/object";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { ref, unref } from "vue";

// Our menu items.
const menuItems = ref([]);

/**
 * The `useMenu` composable provides a way for menu items to register themselves
 * with this central repository. We do this for two reasons: to allow access to
 * menu items from other locations without having to do anything special, and to
 * allow the menu items themselves to control what is registered. For example,
 * if a menu item is removed from the template, or not included based on some
 * check, it won't register itself, and won't appear anywhere else the menu is
 * accessed.
 */
export default function useMenu() {
	/**
	 * Register a menu item, and the section it belongs to.
	 *
	 * @param  {string}  options.section
	 *     The section this menu item belongs to, representing the main menu.
	 * @param  {string}  options.label
	 *     The label for this menu item.
	 * @param  {string}  options.href
	 *     The href for the link, used in a `router-link`'s `to` property.
	 */
	function registerMenuItem({ section, label, to }) {
		const internalSection = unref(section);
		const internalLabel = unref(label);
		const internalTo = unref(to);

		// If we can't determine a key piece of information for a menu item, we
		// can't realistically include it.
		if (!isNonEmptyString(internalSection) || !isNonEmptyString(internalLabel) || (!isNonEmptyString(internalTo) && !isNonEmptyObject(internalTo))) {
			return;
		}

		menuItems.value.push({ section: internalSection, label: internalLabel, to: internalTo });
	}

	/**
	 * Reset our menu. Primarily added for testing, as the list of menu items
	 * persists.
	 */
	function resetMenu() {
		menuItems.value = [];
	}

	return {
		menuItems,
		registerMenuItem,
		resetMenu,
	};
}
