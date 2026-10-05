import { describe, expect, test, vi } from "vite-plus/test";
import { computed, nextTick, ref } from "vue";
import { navigationReasons } from "../navigation-reasons.js";
import useFlowNavigation from "./use-flow-navigation.js";

describe("useFlowNavigation", () => {
	describe("Screen navigation", () => {
		test("prepares focus before changing screens and reports the change", () => {
			const flow = createComposable();
			const calls = [];

			flow.focusHooks.prepareScreenChange.mockImplementation(() => calls.push("prepare"));
			flow.focusHooks.invalidatePendingFocus.mockImplementation(() => calls.push("invalidate"));
			flow.screenIds.value = ["first", "second"];
			flow.activeScreenId.value = "first";
			flow.navigateToScreen("second", { reason: "continue" });

			expect(flow.activeScreenId.value).toBe("second");
			expect(calls).toEqual(["prepare", "invalidate"]);
			expect(flow.emit).toHaveBeenCalledWith("screen-change", {
				destinationId: "second",
				direction: "forward",
				reason: "continue",
				sourceId: "first",
			});
		});

		test("focuses the current screen without emitting a new change", () => {
			const flow = createComposable();

			flow.navigateToScreen("first", { reason: "continue" });

			expect(flow.focusHooks.focusScreen).toHaveBeenCalledWith("first");
			expect(flow.emit).not.toHaveBeenCalled();
		});

		test("returns from review to the active screen", () => {
			const flow = createComposable();

			flow.isShowingReview.value = true;
			flow.navigateBack();

			expect(flow.isShowingReview.value).toBe(false);
			expect(flow.focusHooks.focusScreen).toHaveBeenCalledOnce();
		});

		test("queues a review field before moving to its screen", () => {
			const flow = createComposable();

			flow.screenIds.value = ["first", "second"];
			flow.isShowingReview.value = true;
			flow.changeAnswer({ fieldName: "email", screenId: "second" });

			expect(flow.focusHooks.queueFieldFocus).toHaveBeenCalledWith("email");
			expect(flow.activeScreenId.value).toBe("second");
			expect(flow.isShowingReview.value).toBe(false);
		});
	});

	describe("Validation routing", () => {
		test("advances after valid input on the configured field", async () => {
			const flow = createComposable();

			flow.screenIds.value = ["first", "second"];
			flow.screens.value.first.autoAdvance = ref("choice");
			flow.enableAutoAdvance();
			flow.handleUserFieldInput();

			await flow.updateFieldValueAndAutoAdvance("choice", "yes");
			await nextTick();
			await nextTick();

			expect(flow.validate).toHaveBeenCalledWith({ focus: false });
			expect(flow.activeScreenId.value).toBe("second");
			expect(flow.markScreenComplete).toHaveBeenCalledWith("first");
		});

		test("does not advance after a programmatic update to the configured field", async () => {
			const flow = createComposable();

			flow.screenIds.value = ["first", "second"];
			flow.screens.value.first.autoAdvance = ref("choice");
			flow.enableAutoAdvance();

			await flow.updateFieldValueAndAutoAdvance("choice", "yes");
			await nextTick();

			expect(flow.formData.value.choice).toBe("yes");
			expect(flow.validate).not.toHaveBeenCalled();
			expect(flow.activeScreenId.value).toBe("first");
			expect(flow.markScreenComplete).not.toHaveBeenCalled();
		});

		test("cancels an automatic move when the active screen disappears", async () => {
			const flow = createComposable();

			let finishValidation;

			flow.screenIds.value = ["first", "second"];
			flow.screens.value.first.autoAdvance = ref("choice");
			flow.validate.mockImplementation(
				() =>
					new Promise((resolve) => {
						finishValidation = resolve;
					}),
			);
			flow.enableAutoAdvance();
			flow.handleUserFieldInput();

			await flow.updateFieldValueAndAutoAdvance("choice", "yes");
			await nextTick();
			flow.invalidatePendingNavigation();
			finishValidation();
			await nextTick();

			expect(flow.activeScreenId.value).toBe("first");
			expect(flow.markScreenComplete).not.toHaveBeenCalled();
			expect(flow.focusHooks.invalidatePendingFocus).toHaveBeenCalledOnce();
		});

		test.each([
			["jumping to another screen", (flow) => flow.navigateToScreen("third")],
			["going back", (flow) => flow.navigateBack()],
		])("cancels pending automatic validation when %s", async (_action, navigate) => {
			const flow = createComposable();

			let finishValidation;

			flow.screenIds.value = ["first", "second", "third"];
			flow.screens.value.second = { autoAdvance: ref("choice") };
			flow.activeScreenId.value = "second";
			flow.validate.mockImplementation(
				() =>
					new Promise((resolve) => {
						finishValidation = resolve;
					}),
			);
			flow.enableAutoAdvance();
			flow.handleUserFieldInput();

			await flow.updateFieldValueAndAutoAdvance("choice", "yes");
			await nextTick();

			expect(flow.validate).toHaveBeenCalledOnce();

			navigate(flow);

			const destinationScreenId = flow.activeScreenId.value;

			finishValidation();
			await nextTick();

			expect(flow.activeScreenId.value).toBe(destinationScreenId);
			expect(flow.markScreenComplete).not.toHaveBeenCalled();
		});

		test("returns to the first error screen after submitting from review", async () => {
			const flow = createComposable();

			flow.screenIds.value = ["first", "second"];
			flow.activeScreenId.value = "second";
			flow.isShowingReview.value = true;
			flow.screenFieldNames.value = ["email"];
			flow.screenFieldNamesById.value = { first: ["email"] };
			flow.fieldErrorsFor.mockImplementation((name) => {
				return flow.props.fieldErrors[name] ? [flow.props.fieldErrors[name]] : [];
			});
			flow.handleFormSubmit.mockImplementation(async () => {
				flow.props.fieldErrors = { email: "Required" };
			});

			await flow.navigateForward();

			expect(flow.handleFormSubmit).toHaveBeenCalledWith({ focus: false, scoped: false });
			expect(flow.activeScreenId.value).toBe("first");
			expect(flow.isShowingReview.value).toBe(false);
			expect(flow.emit).toHaveBeenCalledWith("screen-change", {
				destinationId: "first",
				direction: "backward",
				reason: navigationReasons.FINAL_ERROR_RECOVERY,
				sourceId: "second",
			});
			expect(flow.markScreenComplete).not.toHaveBeenCalled();
		});

		test("opens review without submitting after valid final-screen validation", async () => {
			const flow = createComposable();

			flow.props.enableReview = true;

			await flow.navigateForward();

			expect(flow.validate).toHaveBeenCalledWith({ focus: false });
			expect(flow.isShowingReview.value).toBe(true);
			expect(flow.markScreenComplete).toHaveBeenCalledWith("first");
			expect(flow.handleFormSubmit).not.toHaveBeenCalled();
		});

		test("shows errors that do not belong to a visible screen", async () => {
			const flow = createComposable();

			flow.screenIds.value = ["first", "second"];
			flow.formLevelErrors.value = { external: "Unavailable" };

			await flow.navigateForward();

			expect(flow.focusHooks.showFlowErrors).toHaveBeenCalledWith([
				{ fieldName: null, id: null, message: "Unavailable" },
			]);
			expect(flow.activeScreenId.value).toBe("first");
		});
	});
});

/**
 * Set up navigation with refs and stand-ins for the form and focus actions.
 *
 * @returns  {object}
 *     The navigation actions, state, and functions used by the tests.
 */
function createComposable() {
	const activeScreenId = ref("first");
	const screenIds = ref(["first"]);
	const screens = ref({ first: {} });
	const isShowingReview = ref(false);
	const formData = ref({});
	const formLevelErrors = ref({});
	const submitErrors = ref({});
	const flowErrorSummary = ref([]);

	const focusHooks = {
		focusPendingField: vi.fn(),
		focusScreen: vi.fn(),
		invalidatePendingFocus: vi.fn(),
		prepareScreenChange: vi.fn(),
		queueFieldFocus: vi.fn(),
		showFlowErrors: vi.fn(),
	};

	const emit = vi.fn();
	const validate = vi.fn(async () => {});
	const markScreenComplete = vi.fn();

	const updateFieldValue = vi.fn(async (name, value) => {
		formData.value[name] = value;
	});

	const options = {
		state: { activeScreenId, flowErrorSummary, isShowingReview },
		screens: {
			activeScreenIndex: computed(() => screenIds.value.indexOf(activeScreenId.value)),
			canGoBack: computed(
				() => isShowingReview.value || screenIds.value.indexOf(activeScreenId.value) > 0,
			),
			haveActiveScreen: computed(() => screenIds.value.includes(activeScreenId.value)),
			haveActiveScreenErrors: ref(false),
			haveEmptyFlow: computed(() => screenIds.value.length === 0),
			isLastScreen: computed(() => activeScreenId.value === screenIds.value.at(-1)),
			markScreenComplete,
			screenFieldNames: ref([]),
			screenFieldNamesById: ref({}),
			screenIds,
			screens,
		},
		formHost: {
			fieldErrorsFor: vi.fn(() => []),
			formData,
			formLevelErrors,
			handleFormSubmit: vi.fn(async () => {}),
			isSubmitting: ref(false),
			normaliseFieldErrors: (value) => (value ? [value] : []),
			resetSubmitButton: vi.fn(),
			submitErrors,
			updateFieldValue,
			validate,
		},
		focusHooks,
		props: { enableReview: false, fieldErrors: {} },
		emit,
	};

	return {
		...options.state,
		...options.screens,
		...options.formHost,
		focusHooks,
		props: options.props,
		emit,
		...useFlowNavigation(options),
	};
}
