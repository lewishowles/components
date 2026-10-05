import { nextTick, unref } from "vue";
import { isNonEmptyArray } from "@lewishowles/helpers/array";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { navigationReasons } from "../navigation-reasons.js";

/**
 * Move a form flow between screens: validate the current screen on Continue,
 * submit or open review from the last screen, go back, jump to a field from
 * review, and advance automatically when a screen's auto-advance field changes.
 * Focus stays with form-flow, which passes in the focus actions as
 * `focusHooks`.
 *
 * @param  {object}  options
 *     The root state, sibling composables, component props, and event emitter.
 * @param  {function}  options.emit
 *     form-flow's emit, used for `screen-change`.
 * @param  {object}  options.focusHooks
 *     The focus actions from useFlowFocus: `focusPendingField`, `focusScreen`,
 *     `invalidatePendingFocus`, `prepareScreenChange`, `queueFieldFocus`, and
 *     `showFlowErrors`. Navigation calls `prepareScreenChange` before the active
 *     screen changes, and `invalidatePendingFocus` when it cancels pending
 *     navigation.
 * @param  {object}  options.formHost
 *     The form's values, errors, validation, and submission operations.
 * @param  {object}  options.props
 *     form-flow's props. `enableReview` and `fieldErrors` are read each time
 *     they're needed, so later prop changes are picked up.
 * @param  {object}  options.screens
 *     The registered screens and their derived navigation state.
 * @param  {object}  options.state
 *     form-flow's `activeScreenId`, `isShowingReview`, and `flowErrorSummary`
 *     refs. Navigation writes the destination screen to `activeScreenId`, opens
 *     and closes review, and clears the flow-level errors.
 * @returns  {object}
 *     The navigation actions form-flow binds to its template and screen
 *     registration, plus `enableAutoAdvance` for form-flow to call once mounted.
 */
export default function useFlowNavigation({
	emit,
	focusHooks,
	formHost,
	props,
	screens: screenState,
	state,
}) {
	const { activeScreenId, flowErrorSummary, isShowingReview } = state;

	const {
		activeScreenIndex,
		canGoBack,
		haveActiveScreen,
		haveActiveScreenErrors,
		haveEmptyFlow,
		isLastScreen,
		markScreenComplete,
		screenFieldNames,
		screenFieldNamesById,
		screenIds,
		screens,
	} = screenState;

	const {
		fieldErrorsFor,
		formData,
		formLevelErrors,
		handleFormSubmit,
		isSubmitting,
		normaliseFieldErrors,
		resetSubmitButton,
		submitErrors,
		updateFieldValue,
		validate,
	} = formHost;

	// Do not auto-advance while initial data is being applied.
	let isAutoAdvanceReady = false;
	// Native input/change events are the only signal that a model update came
	// from the user. Keep that signal until the next field update consumes it.
	let hasUserInputEvent = false;
	// Automatic validation can finish after a newer change or navigation. Advance
	// this generation so an older result cannot move the flow.
	let autoAdvanceGeneration = 0;

	/**
	 * Let a user's change to an auto-advance field move the flow. form-flow calls
	 * this once mounted, so initial values and v-model seeding never advance it.
	 */
	function enableAutoAdvance() {
		isAutoAdvanceReady = true;
	}

	/**
	 * Cancel pending auto-advance and focus after the active screen disappears.
	 */
	function invalidatePendingNavigation() {
		autoAdvanceGeneration += 1;
		focusHooks.invalidatePendingFocus();
	}

	/**
	 * Record that the next field update came from a native input or change event.
	 */
	function handleUserFieldInput() {
		hasUserInputEvent = true;
	}

	/**
	 * Update a field value and start automatic progression when the change came
	 * directly from the user.
	 *
	 * @param  {string}  name
	 *     The field name.
	 * @param  {unknown}  value
	 *     The new field value.
	 */
	async function updateFieldValueAndAutoAdvance(name, value) {
		const previousValue = formData.value?.[name];
		const wasUserInput = hasUserInputEvent;

		hasUserInputEvent = false;

		await updateFieldValue(name, value);

		if (Object.is(previousValue, value)) {
			return;
		}

		if (wasUserInput) {
			startAutoAdvance(name);
		}
	}

	/**
	 * Start validation for a screen's configured field after a direct user change.
	 *
	 * @param  {string}  fieldName
	 *     The field name that changed.
	 */
	function startAutoAdvance(fieldName) {
		const sourceScreenId = activeScreenId.value;

		if (
			!isAutoAdvanceReady ||
			!isNonEmptyString(sourceScreenId) ||
			unref(screens.value[sourceScreenId]?.autoAdvance) !== fieldName
		) {
			return;
		}

		const requestGeneration = ++autoAdvanceGeneration;

		void navigateForward({
			reason: navigationReasons.AUTOMATIC,
			isRequestStillCurrent: () => autoAdvanceGeneration === requestGeneration,
		});
	}

	/**
	 * Find errors whose field name is not registered to a screen, so they can be
	 * shown as flow-level errors instead of being routed to a screen.
	 *
	 * @returns {object[]}
	 *     Flow-level error summary entries.
	 */
	function getFlowLevelErrors() {
		const registeredFieldNames = new Set(screenFieldNames.value);
		const flowErrors = [];
		const seenErrorKeys = new Set();
		// Form-level rules, submit errors, and errors passed in through the
		// fieldErrors prop.
		const errorSources = [formLevelErrors.value, submitErrors.value, props.fieldErrors];

		for (const source of errorSources) {
			for (const [fieldName, value] of Object.entries(source ?? {})) {
				if (registeredFieldNames.has(fieldName)) {
					continue;
				}

				for (const message of normaliseFieldErrors(value)) {
					const errorKey = `${fieldName}:${message}`;

					if (seenErrorKeys.has(errorKey)) {
						continue;
					}

					seenErrorKeys.add(errorKey);
					flowErrors.push({ fieldName: null, id: null, message });
				}
			}
		}

		return flowErrors;
	}

	/**
	 * Find the first visible screen with a field error, checking screens in their
	 * current order.
	 *
	 * @returns {object|null}
	 *     The screen ID and field name for the first error, or null when no
	 *     visible screen has a field error.
	 */
	function getFirstErrorScreen() {
		for (const screenId of screenIds.value) {
			const fieldNames = screenFieldNamesById.value[screenId] ?? [];

			for (const fieldName of fieldNames) {
				if (fieldErrorsFor(fieldName).length > 0) {
					return { fieldName, screenId };
				}
			}
		}

		return null;
	}

	/**
	 * Set the visible screen and report the change.
	 *
	 * @param  {string}  destinationScreenId
	 *     The screen to display.
	 * @param  {object}  options
	 *     Navigation direction and reason.
	 * @param  {string}  options.direction
	 *     Whether the destination screen is ahead of or behind the source screen.
	 * @param  {boolean}  options.shouldEmitChange
	 *     Whether to emit `screen-change`; false for registration-time navigation
	 *     that has no prior screen to report leaving.
	 * @param  {string}  options.reason
	 *     The screen-change reason to report.
	 */
	function navigateToScreen(
		destinationScreenId,
		{ direction = "forward", shouldEmitChange = true, reason } = {},
	) {
		// Manual or conditional navigation invalidates automatic validation still in flight.
		autoAdvanceGeneration += 1;

		if (!isNonEmptyString(destinationScreenId) || !screenIds.value.includes(destinationScreenId)) {
			return;
		}

		const sourceScreenId = activeScreenId.value;

		if (sourceScreenId === destinationScreenId) {
			void focusHooks.focusScreen(destinationScreenId);

			return;
		}

		focusHooks.prepareScreenChange(reason);

		activeScreenId.value = destinationScreenId;

		// The screen being left may still have a focus attempt in flight while its
		// field registers. Invalidate it before the destination renders.
		focusHooks.invalidatePendingFocus();

		if (shouldEmitChange && isNonEmptyString(sourceScreenId)) {
			emit("screen-change", {
				destinationId: destinationScreenId,
				direction,
				reason,
				sourceId: sourceScreenId,
			});
		}
	}

	/**
	 * Open the review screen over the active screen's content, or do nothing when
	 * review is disabled or the flow has no screens.
	 */
	function navigateToReview() {
		if (!props.enableReview || haveEmptyFlow.value) {
			return;
		}

		isShowingReview.value = true;
		void focusHooks.focusScreen();
	}

	/**
	 * After final validation, navigate to the first visible screen with an
	 * error, or show any unowned error as a flow-level error.
	 */
	async function showFinalErrors() {
		const firstErrorScreen = getFirstErrorScreen();

		if (firstErrorScreen) {
			// Close review so the screen owning the error is visible when navigated to.
			isShowingReview.value = false;
			flowErrorSummary.value = [];

			const destinationIndex = screenIds.value.indexOf(firstErrorScreen.screenId);

			navigateToScreen(firstErrorScreen.screenId, {
				direction: destinationIndex > activeScreenIndex.value ? "forward" : "backward",
				reason: navigationReasons.FINAL_ERROR_RECOVERY,
			});

			return;
		}

		const flowErrors = getFlowLevelErrors();

		if (flowErrors.length > 0) {
			await focusHooks.showFlowErrors(flowErrors);
		}
	}

	/**
	 * Move to the previous screen, skipping validation on the current screen.
	 */
	function navigateBack() {
		// Back from review closes it and returns to the screen behind it.
		if (isShowingReview.value) {
			isShowingReview.value = false;
			flowErrorSummary.value = [];
			void focusHooks.focusScreen();

			return;
		}

		if (!canGoBack.value) {
			return;
		}

		navigateToScreen(screenIds.value[activeScreenIndex.value - 1], {
			direction: "backward",
			reason: navigationReasons.BACK,
		});

		flowErrorSummary.value = [];
	}

	/**
	 * Leave the review screen for a field's owning screen and focus that field,
	 * called when a review Change button is activated.
	 *
	 * @param  {object}  selection
	 *     The field selected from the review screen.
	 * @param  {string}  selection.screenId
	 *     The screen that registered the field.
	 * @param  {string}  selection.fieldName
	 *     The field to focus once its screen is active.
	 */
	function changeAnswer({ fieldName, screenId } = {}) {
		if (
			!isNonEmptyString(screenId) ||
			!isNonEmptyString(fieldName) ||
			!screenIds.value.includes(screenId)
		) {
			return;
		}

		focusHooks.queueFieldFocus(fieldName);
		isShowingReview.value = false;

		// The active screen won't change, so the activeScreenId watcher never
		// fires for it; focus the target directly instead.
		if (screenId === activeScreenId.value) {
			focusHooks.focusPendingField(screenId);

			return;
		}

		const destinationIndex = screenIds.value.indexOf(screenId);

		// Changing activeScreenId is what triggers the activeScreenId watcher,
		// which focuses the target once the destination screen is current.
		navigateToScreen(screenId, {
			direction: destinationIndex > activeScreenIndex.value ? "forward" : "backward",
			reason: navigationReasons.REVIEW,
		});
	}

	/**
	 * Validate the visible screen before moving forward or submitting the flow.
	 *
	 * @param  {object}  options
	 *     The navigation reason and optional check for the latest automatic validation.
	 * @param  {string}  options.reason
	 *     The screen-change reason to report; defaults to a manual Continue.
	 * @param  {function}  options.isRequestStillCurrent
	 *     Returns whether this navigation attempt hasn't been superseded by a
	 *     newer one; defaults to always current for manual navigation.
	 */
	async function navigateForward(options = {}) {
		const reason = options?.reason ?? navigationReasons.CONTINUE;
		const isRequestStillCurrent = options?.isRequestStillCurrent ?? (() => true);

		if (!haveActiveScreen.value || isSubmitting.value) {
			return;
		}

		// Wait a tick so the latest field change has settled into formData before validating.
		await nextTick();

		flowErrorSummary.value = [];

		if (isLastScreen.value) {
			await submitFinalScreen({ isRequestStillCurrent, reason });

			return;
		}

		await continueToNextScreen({ isRequestStillCurrent, reason });
	}

	/**
	 * Handle reaching the final screen: submit it, or open review instead when
	 * review is enabled and not yet showing.
	 *
	 * @param  {object}  options
	 *     The current automatic-navigation check and screen-change reason.
	 * @param  {function}  options.isRequestStillCurrent
	 *     Required. Returns whether this navigation attempt hasn't been
	 *     superseded by a newer one; supplied by navigateForward().
	 * @param  {string}  options.reason
	 *     The screen-change reason to report when review validation fails.
	 */
	async function submitFinalScreen({ isRequestStillCurrent, reason }) {
		// Review already validated the final screen when it opened, so a submit
		// from review and a direct final-screen submit share the same path.
		if (isShowingReview.value || !props.enableReview) {
			await submitAndFinalise(activeScreenId.value, { isRequestStillCurrent });

			return;
		}

		// Review defers final submission: validate the final screen, then open
		// review instead of submitting.
		await validate({ focus: false });

		if (!isRequestStillCurrent()) {
			return;
		}

		const flowErrors = getFlowLevelErrors();

		if (isNonEmptyArray(flowErrors)) {
			await focusHooks.showFlowErrors(flowErrors);

			return;
		}

		if (haveActiveScreenErrors.value) {
			navigateToScreen(activeScreenId.value, { reason });

			return;
		}

		markScreenComplete(activeScreenId.value);
		navigateToReview();
		resetSubmitButton();
	}

	/**
	 * Validate a non-final screen and advance to the next one once it is valid.
	 *
	 * @param  {object}  options
	 *     The current automatic-navigation check and screen-change reason.
	 * @param  {function}  options.isRequestStillCurrent
	 *     Required. Returns whether this navigation attempt hasn't been
	 *     superseded by a newer one; supplied by navigateForward().
	 * @param  {string}  options.reason
	 *     The screen-change reason to report after validation succeeds.
	 */
	async function continueToNextScreen({ isRequestStillCurrent, reason }) {
		// Validate the current screen's fields plus any root-level rule. Only the
		// active screen's fields are mounted, and form-field unregisters them on
		// unmount, so formFields and validate() see no inactive-screen fields.
		await validate({ focus: false });

		if (!isRequestStillCurrent()) {
			return;
		}

		const flowErrors = getFlowLevelErrors();

		if (isNonEmptyArray(flowErrors)) {
			await focusHooks.showFlowErrors(flowErrors);

			return;
		}

		if (haveActiveScreenErrors.value) {
			navigateToScreen(activeScreenId.value, { reason });

			return;
		}

		markScreenComplete(activeScreenId.value);
		navigateToScreen(screenIds.value[activeScreenIndex.value + 1], {
			direction: "forward",
			reason,
		});

		resetSubmitButton();
	}

	/**
	 * Run final submission and mark the given screen complete once it succeeds
	 * with no screen-owned or flow-level errors.
	 *
	 * @param  {string}  screenIdToComplete
	 *     The screen to mark complete after a successful submission.
	 * @param  {object}  options
	 *     The current automatic-navigation check.
	 * @param  {function}  options.isRequestStillCurrent
	 *     Required. Returns whether this navigation attempt hasn't been
	 *     superseded by a newer one; supplied by navigateForward().
	 */
	async function submitAndFinalise(screenIdToComplete, { isRequestStillCurrent }) {
		await handleFormSubmit({
			focus: false,
			scoped: false,
		});

		if (!isRequestStillCurrent()) {
			return;
		}

		await showFinalErrors();

		// Final completion requires no screen-owned error and no flow-level error.
		if (!getFirstErrorScreen() && getFlowLevelErrors().length === 0) {
			markScreenComplete(screenIdToComplete);
		}
	}

	return {
		changeAnswer,
		enableAutoAdvance,
		handleUserFieldInput,
		invalidatePendingNavigation,
		navigateBack,
		navigateForward,
		navigateToScreen,
		updateFieldValueAndAutoAdvance,
	};
}
