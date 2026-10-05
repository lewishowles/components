import { computed, ref, unref } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { navigationReasons } from "../navigation-reasons.js";

/**
 * Track form-flow's screens: which are on show and in what order, which fields
 * belong to each, which are complete, and where the user is in the flow.
 * form-flow keeps ownership of moving between screens and of the form itself,
 * and passes in the functions this needs from both.
 *
 * @param  {object}  options
 *     The current flow state and operations.
 * @param  {object}  options.formHost
 *     The form's field registration and error operations.
 * @param  {object}  options.navigation
 *     The actions that move to a screen or cancel pending navigation. Each one
 *     looks up navigation when called, because navigation is created after the
 *     screen list.
 * @param  {object}  options.state
 *     form-flow's `activeScreenId` and `isShowingReview` refs. When the active
 *     screen disappears, the screen list moves to a neighbouring screen or, if
 *     none remain, clears the active screen and closes review.
 * @returns  {object}
 *     The screen list, the screen details, the derived position and progress
 *     values form-flow renders from, and the functions that register and
 *     remove screens and fields, check which screen is active or complete,
 *     and mark a screen complete.
 */
export default function useFlowScreens({ formHost, navigation, state }) {
	const { activeScreenId, isShowingReview } = state;
	const { fieldErrorsFor, registerField, unregisterField } = formHost;
	const { invalidatePendingNavigation, navigateToScreen } = navigation;

	// The IDs of the screens on show, in slot order. A conditional screen that
	// returns goes back to its original place.
	const screenIds = ref([]);
	// The details of every screen that has registered, keyed by ID. A removed
	// screen keeps its slot order, completion, and answers so they return with it.
	const screens = ref({});

	// The position of the active screen among the screens on show, or -1 when none is active.
	const activeScreenIndex = computed(() => screenIds.value.indexOf(activeScreenId.value));
	// Whether the flow has no screen left to display.
	const haveEmptyFlow = computed(() => screenIds.value.length === 0);
	// Whether a screen is available to render.
	const haveActiveScreen = computed(() => !haveEmptyFlow.value && activeScreenIndex.value >= 0);
	// The label for the screen currently shown in the default progress display.
	const activeScreenProgressLabel = computed(() => getScreenProgress(activeScreenId.value).label);

	// Screen labels and completion state for a custom progress display.
	const progressSlotProps = computed(() => ({
		current: getScreenProgress(activeScreenId.value),
		completed: screenIds.value
			.filter((screenId) => screens.value[screenId]?.completed)
			.map((screenId) => getScreenProgress(screenId)),
		remaining: screenIds.value
			.slice(activeScreenIndex.value + 1)
			.map((screenId) => getScreenProgress(screenId)),
	}));

	// Whether the current screen is the last registered screen.
	const isLastScreen = computed(
		() => haveActiveScreen.value && activeScreenIndex.value === screenIds.value.length - 1,
	);

	// Whether the Back action can move to an earlier screen.
	const canGoBack = computed(() => isShowingReview.value || activeScreenIndex.value > 0);

	// The names of the fields on each screen on show, keyed by screen ID.
	const screenFieldNamesById = computed(() => {
		const namesByScreen = {};

		for (const screenId of screenIds.value) {
			const fieldNames = screens.value[screenId]?.fields;

			if (fieldNames) {
				namesByScreen[screenId] = [...fieldNames];
				continue;
			}

			namesByScreen[screenId] = [];
		}

		return namesByScreen;
	});

	// The names of the fields on every screen on show, in screen order, without duplicates.
	const screenFieldNames = computed(() => [
		...new Set(Object.values(screenFieldNamesById.value).flat()),
	]);

	// Whether the active screen has a field error after validation.
	const haveActiveScreenErrors = computed(() =>
		(screenFieldNamesById.value[activeScreenId.value] ?? []).some(
			(fieldName) => fieldErrorsFor(fieldName).length > 0,
		),
	);

	/**
	 * Return a screen's ID and label for progress displays. A screen without a
	 * label uses its ID instead.
	 *
	 * @param  {string}  screenId
	 *     The screen ID.
	 * @returns  {object}
	 *     The screen ID and its plain-text label.
	 */
	function getScreenProgress(screenId) {
		const screenLabel = unref(screens.value[screenId]?.label);

		return {
			id: screenId,
			label: screenLabel || screenId,
		};
	}

	/**
	 * Register a screen wherever it appears in the default slot.
	 *
	 * @param  {object}  screen
	 *     The screen's registration details from form-screen.
	 * @param  {string}  screen.id
	 *     The screen ID.
	 * @param  {ComputedRef<string | undefined>}  screen.label
	 *     The concise label used by progress displays and answer summaries.
	 * @param  {ComputedRef<string | undefined>}  screen.autoAdvance
	 *     The field name that triggers automatic progression on a direct user change.
	 * @param  {ComputedRef<string | undefined>}  screen.autoFocus
	 *     The field name to focus on entry.
	 * @param  {object}  screen.element
	 *     The screen root ref used to find its title after it renders.
	 */
	function registerScreen({ autoAdvance, autoFocus, element, id: screenId, label } = {}) {
		if (!isNonEmptyString(screenId) || screenIds.value.includes(screenId)) {
			return;
		}

		if (!screens.value[screenId]) {
			screens.value[screenId] = {
				slotOrder: Object.values(screens.value).length,
				completed: false,
			};
		}

		const screen = screens.value[screenId];

		screen.answerFields ??= {};
		screen.fields ??= [];

		screen.label = label;
		screen.autoAdvance = autoAdvance;
		screen.autoFocus = autoFocus;
		screen.element = element;

		// Insert the screen before the first screen that comes after it in the slot,
		// so a returning conditional screen takes back its original place.
		const insertionIndex = screenIds.value.findIndex(
			(registeredScreenId) => screens.value[registeredScreenId]?.slotOrder > screen.slotOrder,
		);

		screenIds.value.splice(
			insertionIndex === -1 ? screenIds.value.length : insertionIndex,
			0,
			screenId,
		);

		if (!isNonEmptyString(activeScreenId.value)) {
			navigateToScreen(screenId, {
				direction: "forward",
				reason: navigationReasons.INITIAL_RENDER,
				shouldEmitChange: false,
			});
		}
	}

	/**
	 * Remove a screen, preserve its original slot order for later reappearance,
	 * and choose the nearest remaining screen if the removed screen was active.
	 *
	 * @param  {string}  screenId
	 *     The screen ID.
	 */
	function unregisterScreen(screenId) {
		const screenIndex = screenIds.value.indexOf(screenId);

		if (screenIndex === -1) {
			return;
		}

		const wasActive = isCurrentScreen(screenId);

		screenIds.value.splice(screenIndex, 1);

		const screen = screens.value[screenId];

		if (screen) {
			// Keep completion, answer summaries, and slotOrder when a conditional screen reappears.
			screens.value[screenId] = {
				answerFields: screen.answerFields,
				completed: screen.completed,
				fields: screen.fields,
				slotOrder: screen.slotOrder,
			};
		}

		if (!wasActive) {
			return;
		}

		// A screen can disappear while its answers are showing in the review
		// screen; fall back to a neighbouring screen, or close review if none remain.
		if (isShowingReview.value) {
			const destinationScreenId =
				screenIds.value[screenIndex] ?? screenIds.value[screenIndex - 1] ?? null;

			if (destinationScreenId) {
				activeScreenId.value = destinationScreenId;
			} else {
				isShowingReview.value = false;
				activeScreenId.value = null;
			}

			return;
		}

		// Fall back to the screen sharing the index this screen had (the next
		// screen), or the previous screen.
		const destinationScreenId =
			screenIds.value[screenIndex] ?? screenIds.value[screenIndex - 1] ?? null;

		if (destinationScreenId) {
			navigateToScreen(destinationScreenId, {
				direction: screenIndex < screenIds.value.length ? "forward" : "backward",
				reason: navigationReasons.CONDITIONAL_RECOVERY,
			});
		} else {
			// The removed screen must not regain focus or navigate when its async work
			// finishes. Clear the active ID so a later screen becomes the first screen.
			invalidatePendingNavigation();
			activeScreenId.value = null;
		}
	}

	/**
	 * Check whether a screen is currently active.
	 *
	 * @param  {string}  screenId
	 *     The screen ID registered with the flow.
	 * @returns {boolean}
	 *     Whether the screen should render its content.
	 */
	function isCurrentScreen(screenId) {
		return activeScreenId.value === screenId;
	}

	/**
	 * Check whether a screen passed validation when moving forward.
	 *
	 * @param  {string}  screenId
	 *     The screen ID registered with the flow.
	 * @returns {boolean}
	 *     Whether the screen is complete.
	 */
	function isScreenComplete(screenId) {
		return Boolean(screens.value[screenId]?.completed);
	}

	/**
	 * Mark a screen complete after it passes validation when moving forward.
	 *
	 * @param  {string}  screenId
	 *     The screen ID registered with the flow.
	 */
	function markScreenComplete(screenId) {
		if (!screenIds.value.includes(screenId) || isScreenComplete(screenId)) {
			return;
		}

		screens.value[screenId].completed = true;
	}

	/**
	 * Register a field with the form and record which screen owns it, so
	 * final validation can route an error back to its screen even after the
	 * field's own component unmounts.
	 *
	 * @param  {object}  field
	 *     The field registration supplied by form-field.
	 * @param  {string}  field.name
	 *     The field name, used to record which screen the field is on.
	 * @param  {string | function}  field.label
	 *     The field's label text, or a function that returns it. Read it while
	 *     rendering, since form-field builds it from its default slot.
	 * @param  {ComputedRef<unknown>}  field.displayValue
	 *     The display value available for answer summaries, or undefined when omitted.
	 * @param  {function}  field.answerSummary
	 *     The field's custom renderer for its answer in a summary, if provided.
	 * @returns  {unknown}
	 *     Whatever the form returns for the registration, unchanged.
	 */
	function registerFlowField(field) {
		const registration = registerField(field);

		if (!isNonEmptyString(activeScreenId.value) || !isNonEmptyString(field.name)) {
			return registration;
		}

		const fieldNames = screens.value[activeScreenId.value]?.fields ?? [];

		if (!fieldNames.includes(field.name)) {
			fieldNames.push(field.name);
		}

		screens.value[activeScreenId.value].fields = fieldNames;

		screens.value[activeScreenId.value].answerFields[field.name] = {
			answerSummary: field.answerSummary,
			displayValue: field.displayValue,
			label: field.label,
		};

		return registration;
	}

	/**
	 * Unregister a field from the form and update its screen. A field that
	 * disappears from the active screen was renamed or conditionally hidden, so
	 * it is removed from that screen. A field on a screen the user has left
	 * keeps its last value, so the review can still show the answer after the
	 * field unmounts.
	 *
	 * @param  {string}  fieldName
	 *     The name of the field being unregistered.
	 */
	function unregisterFlowField(fieldName) {
		const ownerScreenId = screenIds.value.find((candidate) =>
			screens.value[candidate]?.fields?.includes(fieldName),
		);

		if (isNonEmptyString(ownerScreenId)) {
			const screen = screens.value[ownerScreenId];

			// If this field belongs to the active screen, it's been conditionally
			// hidden, so we remove it entirely.
			if (ownerScreenId === activeScreenId.value) {
				screen.fields = screen.fields.filter((name) => name !== fieldName);

				delete screen.answerFields[fieldName];
			} else {
				// Otherwise, we keep its last answer.
				const answerField = screen.answerFields?.[fieldName];

				if (answerField) {
					screen.answerFields[fieldName] = {
						answerSummary: answerField.answerSummary,
						displayValue: unref(answerField.displayValue),
						label: answerField.label,
					};
				}
			}
		}

		unregisterField(fieldName);
	}

	return {
		activeScreenIndex,
		activeScreenProgressLabel,
		canGoBack,
		haveActiveScreen,
		haveActiveScreenErrors,
		haveEmptyFlow,
		isCurrentScreen,
		isLastScreen,
		isScreenComplete,
		markScreenComplete,
		progressSlotProps,
		registerFlowField,
		registerScreen,
		screenFieldNames,
		screenFieldNamesById,
		screenIds,
		screens,
		unregisterFlowField,
		unregisterScreen,
	};
}
