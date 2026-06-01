import { computed, ref } from "vue";
import { getNextIndex, isNonEmptyArray } from "@lewishowles/helpers/array";
import { isFunction } from "@lewishowles/helpers/general";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { nanoid } from "nanoid";

/**
 * `useCombobox` provides the groundwork for implementing a combobox interaction
 * pattern, including ARIA attribute management and keyboard handling.
 *
 * In conjunction with this composable, it is recommended that components use
 * the following to handle closing the menu in the context of the app.
 *
 * const containerElement = useTemplateRef("container");
 * onClickOutside(containerElement, close);
 * onFocusOutside(containerElement, close);
 *
 * @param  {object}  options
 * @param  {string}  [options.listboxId]
 *     ID for the listbox element. Auto-generated if omitted.
 * @param  {Function}  [options.onSelect]
 *     Called with the selected option's ID when an option is chosen.
 */
export function useCombobox({ listboxId: providedListboxId, onSelect } = {}) {
	// The stable ID shared between the input's aria-controls and the listbox.
	const listboxId = providedListboxId ?? nanoid();
	// Whether the listbox popup is currently open.
	const isOpen = ref(false);
	// The ID of the currently highlighted option, or null if none.
	const activeId = ref(null);
	// All registered options in display order: { id, groupId? }
	const registeredOptions = ref([]);
	// Flat ordered list of option IDs, used for keyboard navigation.
	const optionIds = computed(() => registeredOptions.value.map((option) => option.id));

	// ARIA attributes to spread onto the input element.
	const inputAttributes = computed(() => ({
		"aria-activedescendant": activeId.value ?? undefined,
		"aria-autocomplete": "list",
		"aria-controls": listboxId,
		"aria-expanded": isOpen.value,
		role: "combobox",
	}));

	// ARIA attributes to spread onto the listbox element.
	const listboxAttributes = computed(() => ({
		id: listboxId,
		role: "listbox",
	}));

	/**
	 * Get the computed ARIA attributes for an individual option.
	 *
	 * @param  {string}  id
	 *     The option's unique ID.
	 */
	function getOptionAttributes(id) {
		return computed(() => ({
			"aria-selected": activeId.value === id,
			id,
			role: "option",
		}));
	}

	/**
	 * Register an option so it participates in keyboard navigation. Options
	 * are navigated in the order they are registered.
	 *
	 * @param  {string}  id
	 *     The option's unique ID.
	 * @param  {string}  [groupId]
	 *     The group this option belongs to, if grouping is needed.
	 */
	function registerOption(id, groupId) {
		if (!isNonEmptyString(id) || registeredOptions.value.some((option) => option.id === id)) {
			return;
		}

		const entry = { id };

		if (isNonEmptyString(groupId)) {
			entry.groupId = groupId;
		}

		registeredOptions.value.push(entry);
	}

	/**
	 * Unregister an option, removing it from keyboard navigation. If the option
	 * was currently highlighted, the active selection is also cleared.
	 *
	 * @param  {string}  id
	 *     The option's unique ID.
	 */
	function unregisterOption(id) {
		if (!isNonEmptyString(id)) {
			return;
		}

		registeredOptions.value = registeredOptions.value.filter((option) => option.id !== id);

		if (activeId.value === id) {
			activeId.value = null;
		}
	}

	/**
	 * Open the listbox popup.
	 */
	function open() {
		isOpen.value = true;
	}

	/**
	 * Close the listbox popup and clear the active option.
	 */
	function close() {
		isOpen.value = false;
		activeId.value = null;
	}

	/**
	 * Move the active highlight to the next or previous option, wrapping at
	 * either end. If no option is currently highlighted, focus moves to the
	 * first or last option depending on direction.
	 *
	 * @param  {boolean}  reverse
	 *     Whether to move backwards through the list.
	 */
	function moveActive(reverse = false) {
		const ids = optionIds.value;

		if (!isNonEmptyArray(ids)) {
			return;
		}

		// When nothing is highlighted yet, jump to the appropriate end.
		if (activeId.value === null) {
			activeId.value = reverse ? ids.at(-1) : ids[0];

			return;
		}

		const currentIndex = ids.indexOf(activeId.value);

		activeId.value = ids[getNextIndex(currentIndex, ids, { reverse, wrap: true })];
	}

	/**
	 * Select an individual option, which in turn calls the onSelect callback,
	 * and closes the popup. Selects the currently active option when no ID is
	 * provided.
	 *
	 * @param  {string}  [id]
	 *     The option ID to select. Defaults to activeId.
	 */
	function selectOption(id) {
		const targetId = id ?? activeId.value;

		if (!targetId) {
			return;
		}

		if (isFunction(onSelect)) {
			onSelect(targetId);
		}

		close();
	}

	/**
	 * Attach to the input to handle keydown events, implementing the combobox
	 * keyboard functionality: arrow keys open and navigate the list, Enter
	 * selects, Escape closes, and cursor keys return to text editing.
	 *
	 * @param  {KeyboardEvent}  event
	 */
	function handleKeydown(event) {
		const ids = optionIds.value;

		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();

				// Alt+ArrowDown opens without moving focus.
				if (event.altKey) {
					open();

					break;
				}

				if (!isOpen.value) {
					open();

					activeId.value = ids[0] ?? null;

					break;
				}

				moveActive(false);

				break;

			case "ArrowUp":
				event.preventDefault();

				if (!isOpen.value) {
					open();

					activeId.value = ids.at(-1) ?? null;

					break;
				}

				moveActive(true);

				break;

			case "Enter":
				if (!isOpen.value) {
					break;
				}

				event.preventDefault();

				if (activeId.value) {
					selectOption();
				} else {
					close();
				}

				break;

			case "Escape":
				if (!isOpen.value) {
					break;
				}

				event.preventDefault();

				close();

				break;

			// Cursor keys and jump keys return the user to text-editing mode by
			// clearing the active option without preventing default, so the
			// browser handles cursor movement as normal.
			case "ArrowLeft":
			case "ArrowRight":
			case "End":
			case "Home":
				if (activeId.value) {
					activeId.value = null;
				}

				break;
		}
	}

	return {
		activeId,
		close,
		getOptionAttributes,
		handleKeydown,
		inputAttributes,
		isOpen,
		listboxAttributes,
		open,
		optionIds,
		registerOption,
		selectOption,
		unregisterOption,
	};
}
