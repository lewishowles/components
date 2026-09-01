<template>
	<div
		ref="container"
		class="relative"
		:class="{ 'z-10': isOpen }"
		:data-invalid="haveError ? 'true' : undefined"
		:data-state="isOpen ? 'open' : 'closed'"
		data-component="form-combo-box"
		data-test="form-combo-box"
	>
		<div data-part="text-control" data-test="form-combo-box-input">
			<form-input
				ref="input"
				v-model="query"
				v-bind="{
					displayLabel,
					id,
					placeholder,
					required,
					inputAttributes: resolvedInputAttributes,
				}"
				@keydown="handleKeydown"
				@focusin="handleFocusin"
				@focusout="handleFocusout"
				@update:model-value="handleInput"
			>
				<slot />

				<template #optional-indicator>
					<slot name="optional-indicator" />
				</template>

				<template #introduction>
					<slot name="introduction" />
				</template>

				<template #help>
					<slot name="help" />
				</template>

				<template #error>
					<slot name="error" />
				</template>
			</form-input>
		</div>

		<span aria-live="polite" class="sr-only" data-test="form-combo-box-announcement">
			<template v-if="isOpen">
				<template v-if="loading">Loading options.</template>
				<template v-else-if="!haveOptions">No options available.</template>
				<template v-else-if="haveItems">
					{{ itemCount }} {{ itemCount === 1 ? "result" : "results" }} found. Use the arrow keys to
					navigate.
				</template>
				<template v-else>No results found for "{{ query }}".</template>
			</template>
			<template v-else-if="selectionMessage?.type === 'selected'">
				Selected {{ selectionMessage.label }}.
			</template>
			<template v-else-if="selectionMessage?.type === 'cleared'">Selection cleared.</template>
		</span>

		<div
			v-if="isOpen"
			ref="dropdown"
			:class="resolvedDropdownClasses"
			:style="resolvedDropdownStyle"
			data-part="dropdown"
			data-test="form-combo-box-dropdown"
		>
			<div v-if="loading" class="p-3" data-part="status" data-test="form-combo-box-loading">
				<loading-indicator>
					<slot name="loading">Loading…</slot>
				</loading-indicator>
			</div>

			<div
				v-else-if="!haveOptions"
				class="text-content-muted p-3"
				data-part="status"
				data-test="form-combo-box-empty"
			>
				<slot name="empty">No options available.</slot>
			</div>

			<ul
				v-else-if="haveItems"
				v-bind="listboxAttributes"
				class="max-h-64 overflow-y-auto p-1"
				data-part="listbox"
				data-test="form-combo-box-listbox"
			>
				<li
					v-for="entry in filteredItems"
					v-bind="{
						id: entry.id,
						key: entry.id,
						'aria-selected': entry.option.value === selectedValue,
					}"
					:class="{ 'bg-surface-sunken': entry.id === activeId }"
					class="cursor-pointer rounded-md px-3 py-2"
					role="option"
					data-part="option"
					data-test="form-combo-box-option"
					@mousedown.prevent="selectOption(entry.id)"
					@mouseenter="activeId = entry.id"
				>
					<slot
						name="option"
						v-bind="{
							option: entry.originalOption,
							label: entry.option.label,
							value: entry.option.value,
							highlighted: entry.id === activeId,
							selected: entry.option.value === selectedValue,
						}"
					>
						{{ entry.option.label }}
					</slot>
				</li>
			</ul>

			<div
				v-else
				class="text-content-muted p-3"
				data-part="status"
				data-test="form-combo-box-no-results"
			>
				<slot name="no-results" v-bind="{ query }">No results found for "{{ query }}"</slot>
			</div>
		</div>
	</div>
</template>

<script setup>
import { arrayLength } from "@lewishowles/helpers/array";
import { callComponentMethod } from "@lewishowles/helpers/vue";
import { cn } from "@/utilities/cn.js";
import { computed, ref, toRef, useAttrs, useSlots, useTemplateRef, watch } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { isNonEmptySlot } from "@lewishowles/helpers/vue";
import { nanoid } from "nanoid";
import { onClickOutside } from "@vueuse/core";
import { useCombobox, useFloatingPosition } from "@/composables";
import useOptions from "@/components/form/composables/use-options/use-options";

/**
 * `form-combo-box` pairs an input with a list of results, handling the
 * keyboard, ARIA, and open/close behaviour of the combobox interaction pattern
 * on top of the `useCombobox` composable.
 *
 * Only when a result is selected does `form-combo-box` take its value.
 *
 * The `default` slot provides the input's label.
 * The `introduction` slot provides supporting text beneath the label.
 * The `option` slot receives the original option, normalised label and value,
 * and highlighted and selected state. Option content must not contain nested
 * interactive controls.
 * The `no-results` slot replaces the no-results message.
 * The `loading` slot replaces the loading message.
 */
const props = defineProps({
	/**
	 * The options for this combo-box. Options can be a string, used for both
	 * the label and value, an object containing a "label" and "value", or an
	 * object in conjunction with the `labelKey` and `valueKey` props.
	 */
	options: {
		type: [Array, Object],
		default: () => [],
	},

	/**
	 * The key needed to find each option's label within its object. If an
	 * individual option is a string or number, this is ignored.
	 */
	labelKey: {
		type: String,
		default: "label",
	},

	/**
	 * The key needed to find each option's value within its object. If an
	 * individual option is a string or number, this is ignored.
	 */
	valueKey: {
		type: String,
		default: "value",
	},

	/**
	 * Whether results are currently loading. While loading, a message is shown
	 * in place of the results.
	 */
	loading: {
		type: Boolean,
		default: false,
	},

	/**
	 * Any ID to apply to the input. If an ID is not provided, one is generated
	 * at random. When providing an ID, please make sure that it is unique.
	 */
	id: {
		type: String,
		default: null,
	},

	/**
	 * Any placeholder to show in the input. This can hint at the kind of value
	 * the user is entering.
	 */
	placeholder: {
		type: String,
		default: null,
	},

	/**
	 * Any additional attributes to pass to the text input, such as
	 * `autocomplete`.
	 */
	inputAttributes: {
		type: Object,
		default: null,
	},

	/**
	 * Whether the field is required.
	 */
	required: {
		type: Boolean,
		default: false,
	},

	/**
	 * Whether to display the field label. The label remains available to screen
	 * readers when hidden.
	 */
	displayLabel: {
		type: Boolean,
		default: true,
	},

	/**
	 * Whether to open the results above or below the input. The list flips to
	 * the opposite side if it would clip the viewport edge.
	 */
	placement: {
		type: String,
		default: "below",
	},

	/**
	 * Additional classes to apply to the results list, merged on top of its base
	 * styles. The results list always matches the input's own position and
	 * width, so a width or position class provided here has no effect.
	 */
	dropdownClasses: {
		type: [String, Array, Object],
		default: null,
	},
});

const attributes = useAttrs();
const slots = useSlots();

// Keep the model value separate from the text shown in the input.
const selectedValue = defineModel({
	type: [String, Number],
});

// Whether the inherited readonly attribute should prevent user interaction.
const isReadonly = computed(
	() =>
		attributes.readonly !== undefined &&
		attributes.readonly !== null &&
		attributes.readonly !== false,
);

// Whether validation error content has been supplied for the field state hook.
const haveError = computed(() => isNonEmptySlot(slots.error));

// The current input value.
const query = ref("");
// The label for the selected value, used to tell whether the query has since
// changed.
const displayedLabel = ref("");
// The selection message shown after the initial model synchronisation.
const selectionMessage = ref(null);
// Skip the initial model sync when announcing selection changes.
const shouldAnnounceSelection = ref(false);

// Standardised options.
const { options: internalOptions } = useOptions(toRef(props, "options"), {
	labelKey: props.labelKey,
	valueKey: props.valueKey,
});

// Keep the first option for each value and collect later duplicates for a
// development warning.
const resolvedOptions = computed(() => {
	const seenValues = new Set();
	const duplicateValues = new Set();

	const uniqueOptions = internalOptions.value.filter((option) => {
		if (seenValues.has(option.value)) {
			duplicateValues.add(option.value);

			return false;
		}

		seenValues.add(option.value);

		return true;
	});

	return { duplicateValues, uniqueOptions };
});

// Warn once for each duplicated value whenever the options are refreshed.
watch(
	() => resolvedOptions.value.duplicateValues,
	(duplicateValues) => {
		if (!import.meta.env.DEV) {
			return;
		}

		duplicateValues.forEach((value) => {
			console.warn(`[form-combo-box] Duplicate option value "${value}". Keeping the first option.`);
		});
	},
	{ immediate: true },
);

// A stable prefix for option IDs, shared with the listbox, that keeps them from
// clashing with other IDs on the page.
const listboxId = nanoid();

// Each result paired with the ID used for its element and for keyboard
// navigation, together with its original option for richer slot content. The
// ID is derived from the result's position rather than the item itself, so
// callers can merge results from several sources without worrying about their
// IDs clashing.
const internalItems = computed(() =>
	resolvedOptions.value.uniqueOptions.map((option, index) => ({
		id: `${listboxId}-${index}`,
		option,
		originalOption: option.originalOption,
	})),
);

// The options that match the current query.
const filteredItems = computed(() => {
	// Treat the selected label as display text until the user edits it.
	const filter = query.value === displayedLabel.value ? "" : query.value.toLowerCase();

	if (!filter) {
		return internalItems.value;
	}

	return internalItems.value.filter((entry) =>
		String(entry.option.label).toLowerCase().includes(filter),
	);
});

// The ordered, filtered option IDs handed to the combobox for keyboard navigation.
const optionIds = computed(() => filteredItems.value.map((entry) => entry.id));

const {
	activeId,
	close: closeResults,
	handleKeydown: handleComboboxKeydown,
	inputAttributes: comboboxInputAttributes,
	isOpen,
	listboxAttributes,
	open: openResults,
	selectOption,
} = useCombobox({ listboxId, options: optionIds, onSelect: selectItem });

// Combine the caller's input attributes with combobox state and field requirements.
const resolvedInputAttributes = computed(() => ({
	...props.inputAttributes,
	...comboboxInputAttributes.value,
	"aria-required": props.required ? "true" : undefined,
	readonly: isReadonly.value ? "true" : undefined,
}));

// A reference to the root element, so we can close the results when the user
// interacts elsewhere.
const containerElement = useTemplateRef("container");

// Resolve the input wrapper used for positioning measurements rather than the
// full field, which also contains the label and supplementary text.
const fieldWrapperElement = computed(() =>
	containerElement.value?.querySelector("[data-part='field-wrapper']"),
);

// A reference to the input, so we can move focus to it on demand.
const inputComponent = useTemplateRef("input");
// A reference to the results list, used to measure and position it.
const dropdownElement = useTemplateRef("dropdown");

const {
	computedPlacement,
	isPositioning,
	placementClasses,
	positioningTick,
	handleOpen: handleFloatingOpen,
	handleClose: handleFloatingClose,
} = useFloatingPosition({
	triggerElement: fieldWrapperElement,
	panelElement: dropdownElement,
	initialPlacement: toRef(props, "placement"),
	// The dropdown always matches the field wrapper's own width, so there is
	// no opposite side for it to align to.
	initialAlign: ref("start"),
});

// The number of results currently shown.
const itemCount = computed(() => arrayLength(filteredItems.value));
// Whether any options were provided.
const haveOptions = computed(() => arrayLength(internalItems.value) > 0);
// Whether there are any filtered results to show.
const haveItems = computed(() => itemCount.value > 0);

// The currently selected result, if any.
const selectedItem = computed(() =>
	internalItems.value.find((entry) => entry.option.value === selectedValue.value),
);

// The full class list for the results list: base styling merged with the
// resolved position and any caller overrides. Width and horizontal position
// come from resolvedDropdownStyle instead, since the field wrapper can be
// narrower than the root (e.g. once an error marker adds start padding).
const resolvedDropdownClasses = computed(() =>
	cn(
		"absolute z-10 overflow-hidden rounded-md border border-border bg-surface-elevated shadow-lg",
		placementClasses.value,
		{ "opacity-0": isPositioning.value },
		props.dropdownClasses,
	),
);

// Position and size the dropdown against the field wrapper while keeping the
// root as its containing block for the existing absolute layout. Matching the
// field wrapper's own left and width, rather than assuming it spans the root,
// keeps the dropdown aligned when an error marker narrows the field wrapper.
const resolvedDropdownStyle = computed(() => {
	// Geometry can change on resize or reopen without placement flipping,
	// which a reference check alone would miss. Reading positioningTick here
	// forces a re-evaluation on every recalculation.
	void positioningTick.value;

	const container = containerElement.value;
	const fieldWrapper = fieldWrapperElement.value;
	const placement = computedPlacement.value;

	if (!fieldWrapper || !container) {
		return {};
	}

	const fieldWrapperRect = fieldWrapper.getBoundingClientRect();
	const containerRectangle = container.getBoundingClientRect();
	const fieldWrapperTop = fieldWrapperRect.top - containerRectangle.top;
	const fieldWrapperBottom = fieldWrapperTop + fieldWrapperRect.height;

	const horizontalStyle = {
		left: `${fieldWrapperRect.left - containerRectangle.left}px`,
		width: `${fieldWrapperRect.width}px`,
	};

	if (placement === "above") {
		return {
			...horizontalStyle,
			bottom: `${containerRectangle.height - fieldWrapperTop}px`,
			top: undefined,
		};
	}

	return {
		...horizontalStyle,
		bottom: undefined,
		top: `${fieldWrapperBottom}px`,
	};
});

// Measure and position the results whenever they open, and tear the positioning
// listeners down again when they close.
watch(isOpen, (currentlyOpen) => {
	if (currentlyOpen) {
		handleFloatingOpen();

		return;
	}

	handleFloatingClose();
});

onClickOutside(containerElement, handleClickOutside);

// Sync the displayed query with the model's label whenever the selected value
// changes, including on initial mount and when the model is set externally.
// Also announce the change, skipping the immediate initial call so mounting
// with a prefilled value doesn't announce a selection nobody just made.
watch(
	selectedValue,
	(value) => {
		const previousDisplayedLabel = displayedLabel.value;
		const selectedEntry = selectedItem.value;

		if (selectedEntry) {
			displayedLabel.value = String(selectedEntry.option.label);
			query.value = displayedLabel.value;

			if (shouldAnnounceSelection.value) {
				selectionMessage.value = {
					label: displayedLabel.value,
					type: "selected",
				};
			}

			shouldAnnounceSelection.value = true;

			return;
		}

		displayedLabel.value = "";

		if (query.value === previousDisplayedLabel) {
			query.value = "";
		}

		if (shouldAnnounceSelection.value) {
			selectionMessage.value = { type: "cleared" };
		}

		shouldAnnounceSelection.value = true;
	},
	{ immediate: true },
);

// Refresh the displayed label when options change, in case the selected
// option's label changed too. A value not yet present in the new options is
// left as-is until a loading cycle finishes.
watch(internalItems, () => {
	const selectedEntry = selectedItem.value;

	if (!selectedEntry) {
		return;
	}

	displayedLabel.value = String(selectedEntry.option.label);
	query.value = displayedLabel.value;
});

// Reconcile a selected value only after loading has finished, so options that
// are temporarily absent during loading do not clear a valid selection.
watch(
	() => props.loading,
	(currentlyLoading, previouslyLoading) => {
		if (previouslyLoading !== true || currentlyLoading !== false) {
			return;
		}

		if (selectedValue.value === null || selectedValue.value === undefined || selectedItem.value) {
			return;
		}

		selectedValue.value = null;
	},
);

// A readonly field must keep showing the selected label and never clear the
// model, so revert any query drift back to that label instead of treating it
// as an edit. Otherwise, clear the selected value once the visible query no
// longer matches its label, since editing or clearing the text means the
// previous selection no longer represents what's shown.
watch(query, (value) => {
	if (isReadonly.value) {
		if (value !== displayedLabel.value) {
			query.value = displayedLabel.value;
		}

		return;
	}

	if (value === displayedLabel.value) {
		return;
	}

	displayedLabel.value = "";

	if (selectedValue.value !== null && selectedValue.value !== undefined) {
		selectedValue.value = null;
	}
});

/**
 * Handle a result being chosen: sets the model to its value and syncs the
 * displayed label and query to match.
 *
 * @param  {string}  id
 *     The chosen result's internal ID.
 */
function selectItem(id) {
	if (isReadonly.value) {
		return;
	}

	const entry = internalItems.value.find((entry) => entry.id === id);

	if (!entry) {
		return;
	}

	displayedLabel.value = String(entry.option.label);
	selectedValue.value = entry.option.value;
	query.value = displayedLabel.value;

	closeResults();
}

/**
 * Clear query text that no longer matches the selected label.
 */
function clearEditedQuery() {
	if (query.value !== displayedLabel.value) {
		query.value = "";
	}
}

/**
 * Close the results and clear any edited query text.
 */
function closeAndClear() {
	closeResults();
	clearEditedQuery();
}

/**
 * Handle keyboard interaction: Tab closes and clears, Backspace/Delete drops
 * the highlighted option, and other keys delegate to the combobox.
 *
 * @param  {KeyboardEvent}  event
 *     The input keyboard event.
 */
function handleKeydown(event) {
	if (isReadonly.value) {
		return;
	}

	if (event.key === "Tab") {
		// Close and clear before focus leaves the field.
		closeAndClear();

		return;
	}

	// Text edits invalidate the highlighted option.
	if (["Backspace", "Delete"].includes(event.key)) {
		activeId.value = null;
	}

	handleComboboxKeydown(event);
}

/**
 * Open the options when the text input receives focus.
 */
function handleFocusin() {
	if (!isReadonly.value) {
		openResults();
	}
}

/**
 * Close the results and clear unfinished input when focus leaves the component.
 *
 * @param  {FocusEvent}  event
 *     The input focus event.
 */
function handleFocusout(event) {
	if (containerElement.value?.contains(event.relatedTarget)) {
		return;
	}

	closeAndClear();
}

/**
 * Close the results and clear unfinished input after a click outside.
 */
function handleClickOutside() {
	closeAndClear();
}

/**
 * Handle changes to the input text, opening results for a query and closing
 * them when it is empty. Readonly fields restore the selected label, while
 * editing clears the previous selection.
 */
function handleInput(value) {
	if (isReadonly.value) {
		query.value = displayedLabel.value;

		return;
	}

	if (value !== displayedLabel.value) {
		displayedLabel.value = "";

		if (selectedValue.value !== null && selectedValue.value !== undefined) {
			selectedValue.value = null;
		}
	}

	if (isNonEmptyString(value)) {
		openResults();

		return;
	}

	closeResults();
}

/**
 * Move focus to the text input.
 */
function triggerFocus() {
	callComponentMethod(inputComponent.value, "triggerFocus");
}

defineExpose({
	triggerFocus,
});
</script>
