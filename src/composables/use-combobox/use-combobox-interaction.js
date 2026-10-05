import { computed, useTemplateRef, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useFloatingPosition } from "@/composables/use-floating-position/use-floating-position.js";
import { useCombobox } from "./use-combobox.js";

/**
 * Set up the combo box behaviour that combo-box and form-combo-box share:
 * keyboard navigation through useCombobox, positioning the results, and
 * closing them on an outside click or when focus leaves the component. Each
 * component decides what closing does, such as whether its typed query is
 * cleared.
 *
 * The caller's template must use the refs `container` (the root element),
 * `input` (the input component) and `dropdown` (the results list).
 *
 * @param  {object}  options
 * @param  {string}  options.listboxId
 *     The listbox's ID. The caller builds its option IDs from it.
 * @param  {object}  options.optionIds
 *     A ref holding the option IDs in display order, for keyboard navigation.
 * @param  {Function}  options.onSelect
 *     Receives the ID of the option the user chooses.
 * @param  {Function}  options.positionAgainst
 *     Receives the root element and returns the element to position the
 *     results against, which can be the root itself.
 * @param  {object}  options.placement
 *     A ref holding the preferred side for the results.
 * @param  {object}  options.align
 *     A ref holding the preferred alignment for the results.
 * @param  {Function}  options.onDismiss
 *     Runs when the user clicks outside the component or moves focus out of it.
 *
 * @returns  {object}
 *     The combobox state, attributes and handlers, the template refs, and the
 *     positioning state for the results.
 */
export function useComboboxInteraction({
	listboxId,
	optionIds,
	onSelect,
	positionAgainst,
	placement,
	align,
	onDismiss,
}) {
	// The root element, used to tell clicks and focus outside the component from
	// those inside it.
	const containerElement = useTemplateRef("container");
	// The input component, so the caller can move focus to it.
	const inputComponent = useTemplateRef("input");
	// The results list, measured and positioned when it opens.
	const dropdownElement = useTemplateRef("dropdown");
	// The element the results are positioned against.
	const triggerElement = computed(() => positionAgainst(containerElement.value));

	const {
		activeId,
		close: closeResults,
		handleKeydown,
		inputAttributes,
		isOpen,
		listboxAttributes,
		open: openResults,
		selectOption,
	} = useCombobox({ listboxId, options: optionIds, onSelect });

	const {
		computedAlign,
		computedPlacement,
		handleClose: handleFloatingClose,
		handleOpen: handleFloatingOpen,
		isPositioning,
		placementClasses,
		positioningTick,
	} = useFloatingPosition({
		triggerElement,
		panelElement: dropdownElement,
		initialPlacement: placement,
		initialAlign: align,
	});

	// Measure and position the results whenever they open, and remove the
	// positioning listeners again when they close.
	watch(isOpen, async (currentlyOpen) => {
		if (currentlyOpen) {
			await handleFloatingOpen();

			// The results can close while they are still being measured. Stop
			// positioning them again, or the listeners added on open would stay
			// attached to a closed list.
			if (!isOpen.value) {
				handleFloatingClose();
			}

			return;
		}

		handleFloatingClose();
	});

	onClickOutside(containerElement, onDismiss);

	/**
	 * Dismiss the results when focus leaves the component. Focus moving to
	 * another element inside the component (should one ever exist) keeps them
	 * open.
	 *
	 * @param  {FocusEvent}  event
	 *     The focusout event, whose relatedTarget is where focus is going.
	 */
	function handleFocusout(event) {
		if (containerElement.value?.contains(event.relatedTarget)) {
			return;
		}

		onDismiss();
	}

	return {
		activeId,
		closeResults,
		computedAlign,
		computedPlacement,
		containerElement,
		handleFocusout,
		handleKeydown,
		inputAttributes,
		inputComponent,
		isOpen,
		isPositioning,
		listboxAttributes,
		openResults,
		placementClasses,
		positioningTick,
		selectOption,
	};
}
