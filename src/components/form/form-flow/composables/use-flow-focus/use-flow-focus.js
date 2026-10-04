import { nextTick, toValue, unref, watch } from "vue";
import { isNonEmptyString } from "@lewishowles/helpers/string";
import { breakpointsTailwind, until, useBreakpoints } from "@vueuse/core";

/**
 * Manage focus and scrolling when a form flow changes screens or shows errors.
 *
 * @param  {object}  options
 *     The flow state, focus targets, and field operations owned by form-flow.
 * @param  {Ref<string|null>}  options.activeScreenId
 *     The screen currently shown.
 * @param  {Ref<object|null>}  options.errorSummaryElement
 *     The shared error summary's focus target.
 * @param  {Ref<object[]>}  options.flowErrorSummary
 *     Flow-level errors shown in the shared summary.
 * @param  {function}  options.focusField
 *     Focus a registered field by name.
 * @param  {object}  options.formFields
 *     Registered fields, keyed by name.
 * @param  {Ref<Element|null>}  options.formFlow
 *     The flow element used as the scroll anchor.
 * @param  {ComputedRef<boolean>}  options.haveAnyErrorSummary
 *     Whether the shared error summary has messages.
 * @param  {Ref<boolean>}  options.isShowingReview
 *     Whether the review screen is showing.
 * @param  {object}  options.navigationReasons
 *     The reasons for changing screens, including the initial render.
 * @param  {Ref<Element|null>}  options.reviewHeading
 *     The review heading's focus target.
 * @param  {Ref<object>}  options.screens
 *     Registered screens, keyed by ID.
 * @returns  {object}
 *     The focus actions used by screen navigation.
 */
export default function useFlowFocus({
	activeScreenId,
	errorSummaryElement,
	flowErrorSummary,
	focusField,
	formFields,
	formFlow,
	haveAnyErrorSummary,
	isShowingReview,
	navigationReasons,
	reviewHeading,
	screens,
}) {
	// Whether the viewport is below the Tailwind `lg` breakpoint, where a virtual
	// keyboard can cover a focused field, so the field path always scrolls it into view.
	const isNarrow = useBreakpoints(breakpointsTailwind).smaller("lg");

	// Each focus attempt takes the next number. An attempt that finishes after a
	// newer one has started does nothing, so it can't steal focus from where the
	// user has since moved.
	let focusGeneration = 0;
	// Initial screen registration must not move focus before the user navigates.
	let shouldSkipInitialFocus = false;
	// Only the first screen activation can suppress its focus move.
	let isBeforeFirstScreenActivation = true;
	// The field a review Change button asked to focus, until the next focus attempt consumes it.
	let pendingFieldFocus = null;

	// The focus actions that screen navigation calls.
	const focusHooks = {
		focusPendingField,
		focusScreen,
		showFlowErrors,
		/**
		 * Remember a field to focus when its screen next becomes active.
		 *
		 * @param  {string}  fieldName
		 *     The field a review Change button asked to focus.
		 */
		queueFieldFocus(fieldName) {
			pendingFieldFocus = fieldName;
		},
		/**
		 * Skip the focus move for the first screen shown at registration, so the
		 * flow doesn't take focus before the user does anything. Any later screen
		 * change moves focus as usual.
		 *
		 * @param  {string}  reason
		 *     The screen-change reason for the navigation about to happen.
		 */
		prepareScreenChange(reason) {
			if (reason === navigationReasons.INITIAL_RENDER && isBeforeFirstScreenActivation) {
				shouldSkipInitialFocus = true;
			}

			isBeforeFirstScreenActivation = false;
		},
		/**
		 * Stop any focus lookup already in flight from moving focus.
		 */
		invalidatePendingFocus() {
			focusGeneration += 1;
		},
	};

	// When the active screen changes, focus the new screen once Vue has rendered it,
	// unless it is the first screen shown at registration. Fields can register
	// later, so the field path waits for them.
	watch(
		activeScreenId,
		(destinationScreenId) => {
			if (!isNonEmptyString(destinationScreenId)) {
				return;
			}

			if (shouldSkipInitialFocus) {
				shouldSkipInitialFocus = false;

				return;
			}

			focusPendingField(destinationScreenId);
		},
		{ flush: "post" },
	);

	/**
	 * Find a screen's rendered heading element, once its content has mounted.
	 *
	 * @param  {string}  screenId
	 *     The destination screen ID.
	 * @returns {Element|null}
	 *     The screen heading, when the screen is rendered.
	 */
	function getScreenHeading(screenId) {
		const screenElement = toValue(screens.value[screenId]?.element);

		return screenElement?.querySelector?.('[data-part="title"]') ?? null;
	}

	/**
	 * Move focus to the shared error-summary box once its current content
	 * (the current screen's own errors, or flow-level errors) has rendered.
	 *
	 * @param  {number}  [requestGeneration]
	 *     The focus generation this call belongs to. Omit when calling outside a
	 *     tracked focus attempt (e.g. showing a flow-level error directly), which
	 *     always proceeds.
	 */
	async function focusErrorSummaryBox(requestGeneration) {
		await nextTick();

		// If a later focus attempt has started, this one is stale; cancel it.
		if (requestGeneration && requestGeneration !== focusGeneration) {
			return;
		}

		errorSummaryElement.value?.focus?.();
	}

	/**
	 * Move focus to a field once it has registered, since a screen renders
	 * before its field completes registration in a later update.
	 *
	 * @param  {string}  fieldName
	 *     The field name to focus.
	 * @param  {number}  requestGeneration
	 *     The focus generation this call belongs to.
	 * @returns {boolean}
	 *     Whether the field was focused.
	 */
	async function focusRegisteredField(fieldName, requestGeneration) {
		if (!isNonEmptyString(fieldName)) {
			return false;
		}

		if (!formFields[fieldName]) {
			await until(() => formFields[fieldName]).toBeTruthy({
				timeout: 1000,
				throwOnTimeout: false,
			});
		}

		// If we can't find the field, or a later focus attempt has started, cancel.
		if (!formFields[fieldName] || requestGeneration !== focusGeneration) {
			return false;
		}

		focusField(fieldName);

		return true;
	}

	/**
	 * Scroll the currently focused element into view. Native focus already does
	 * this in real browsers, but aligns to whichever edge needs the least
	 * scrolling, which can leave a field's own label off-screen above it;
	 * scrolling the field's own wrapper instead of the bare input keeps the
	 * label with it, and matches the flow-level scroll's "start" alignment.
	 *
	 * @param  {object}  options
	 *     Options for this scroll.
	 * @param  {boolean}  options.force
	 *     Scroll even when the target is already fully visible. The field path
	 *     sets this on narrow viewports, where the keyboard opens after focus and
	 *     hides part of the page without changing window.innerHeight, so the
	 *     measurement below would call a covered field visible.
	 */
	function scrollFocusedElementIntoView({ force = false } = {}) {
		const focused = document.activeElement;

		if (!focused || focused === document.body) {
			return;
		}

		const target = focused.closest('[data-part="field"]') ?? focused;
		const { bottom, top } = target.getBoundingClientRect();

		if (force || top < 0 || bottom > window.innerHeight) {
			target.scrollIntoView?.({ block: "start" });
		}
	}

	/**
	 * Scroll the top of the flow into view when it sits outside the viewport.
	 * The paths that focus something at the top of the flow use this, so whatever
	 * sits above that target, such as the step indicator, stays visible with it.
	 */
	function scrollFlowIntoView() {
		const flowTop = formFlow.value?.getBoundingClientRect().top;

		if (flowTop === undefined || flowTop < 0 || flowTop >= window.innerHeight) {
			formFlow.value?.scrollIntoView?.({ block: "start" });
		}
	}

	/**
	 * Focus a screen once its content and errors have rendered, scrolling to whichever target takes
	 * focus.
	 *
	 * @param  {string}  screenId
	 *     The screen whose summary, requested field, auto-focus field, or title should receive focus.
	 * @param  {object}  options
	 *     Focus options for this attempt.
	 * @param  {string}  options.fieldName
	 *     A field to focus instead of the screen's own auto-focus field, set by a review Change button.
	 */
	async function focusScreen(screenId = activeScreenId.value, { fieldName } = {}) {
		const requestGeneration = ++focusGeneration;

		await nextTick();

		// If a later focus attempt has started, this one is stale; cancel it.
		if (requestGeneration !== focusGeneration) {
			return;
		}

		// If we have an error summary, focus it.
		if (haveAnyErrorSummary.value) {
			scrollFlowIntoView();

			await focusErrorSummaryBox(requestGeneration);

			return;
		}

		// The review screen has no per-field target; focus its own heading.
		if (isShowingReview.value) {
			scrollFlowIntoView();

			reviewHeading.value?.focus?.();

			return;
		}

		const screen = screens.value[screenId];

		if (!screen) {
			return;
		}

		const autoFocus = isNonEmptyString(fieldName) ? fieldName : unref(screen.autoFocus);

		// Attempt to focus the listed field.
		if (isNonEmptyString(autoFocus)) {
			if (await focusRegisteredField(autoFocus, requestGeneration)) {
				scrollFocusedElementIntoView({ force: isNarrow.value });

				return;
			}

			// If a later focus attempt has started, this one is stale; cancel it.
			if (requestGeneration !== focusGeneration) {
				return;
			}
		}

		// Fall back to focusing the header of the screen.
		scrollFlowIntoView();

		const heading = getScreenHeading(screenId);

		heading?.focus?.();
		scrollFocusedElementIntoView();
	}

	/**
	 * Show flow-level errors and move focus to their summary.
	 *
	 * @param  {object[]}  errors
	 *     Flow-level error summary entries.
	 */
	async function showFlowErrors(errors) {
		flowErrorSummary.value = errors;

		await focusErrorSummaryBox();
	}

	/**
	 * Focus the field a review Change button requested, once its screen is active.
	 * Clears the pending request first so a later navigation can't reuse it.
	 *
	 * @param  {string}  screenId
	 *     The screen the requested field belongs to.
	 */
	function focusPendingField(screenId) {
		const fieldName = pendingFieldFocus;

		pendingFieldFocus = null;

		void focusScreen(screenId, { fieldName });
	}

	return focusHooks;
}
