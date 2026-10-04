import { describe, expect, test, vi } from "vite-plus/test";
import { ref } from "vue";
import useFlowScreens from "./use-flow-screens.js";

describe("useFlowScreens", () => {
	describe("Screen registration", () => {
		test("restores a conditional screen to its original slot order", () => {
			const flow = createComposable();

			flow.registerScreen({ id: "first" });
			flow.registerScreen({ id: "middle" });
			flow.registerScreen({ id: "last" });
			flow.unregisterScreen("middle");
			flow.registerScreen({ id: "middle" });

			expect(flow.screenIds.value).toEqual(["first", "middle", "last"]);
			expect(flow.navigateToScreen).toHaveBeenCalledWith("first", {
				direction: "forward",
				reason: "initial-render",
				shouldEmitChange: false,
			});
		});

		test("keeps completion and answers while recovering from an active screen removal", () => {
			const flow = createComposable();
			const displayValue = ref("Saved answer");

			flow.registerScreen({ id: "first" });
			flow.registerScreen({ id: "second" });
			flow.activeScreenId.value = "first";
			flow.registerFlowField({ name: "answer", displayValue, label: "Answer" });
			flow.markScreenComplete("first");
			flow.unregisterScreen("first");

			expect(flow.screens.value.first.completed).toBe(true);
			displayValue.value = "Updated answer";
			expect(flow.screens.value.first.answerFields.answer.displayValue).toBe("Updated answer");
			expect(flow.navigateToScreen).toHaveBeenLastCalledWith("second", {
				direction: "forward",
				reason: "conditional-screen-recovery",
			});
		});

		test("invalidates pending work when the last screen disappears", () => {
			const flow = createComposable();

			flow.registerScreen({ id: "only" });
			flow.unregisterScreen("only");

			expect(flow.invalidatePendingNavigation).toHaveBeenCalledOnce();
			expect(flow.activeScreenId.value).toBeNull();
			expect(flow.haveEmptyFlow.value).toBe(true);
		});

		test("keeps review open when the active screen disappears and a neighbour remains", () => {
			const flow = createComposable();

			flow.registerScreen({ id: "first" });
			flow.registerScreen({ id: "second" });
			flow.isShowingReview.value = true;
			flow.navigateToScreen.mockClear();
			flow.unregisterScreen("first");

			expect(flow.activeScreenId.value).toBe("second");
			expect(flow.isShowingReview.value).toBe(true);
			expect(flow.navigateToScreen).not.toHaveBeenCalled();
		});

		test("closes review when its only screen disappears", () => {
			const flow = createComposable();

			flow.registerScreen({ id: "only" });
			flow.isShowingReview.value = true;
			flow.unregisterScreen("only");

			expect(flow.isShowingReview.value).toBe(false);
			expect(flow.activeScreenId.value).toBeNull();
		});
	});

	describe("Field ownership", () => {
		test("records a field on its active screen and forwards form registration", () => {
			const flow = createComposable();
			const field = { name: "email", label: "Email", displayValue: ref("a@example.com") };

			flow.registerScreen({ id: "contact" });
			const registration = flow.registerFlowField(field);

			expect(registration).toBe("registered");
			expect(flow.registerField).toHaveBeenCalledWith(field);
			expect(flow.screenFieldNamesById.value).toEqual({ contact: ["email"] });
			expect(flow.screenFieldNames.value).toEqual(["email"]);
		});

		test("removes a field hidden on its active screen", () => {
			const flow = createComposable();

			flow.registerScreen({ id: "contact" });
			flow.registerFlowField({ name: "email", displayValue: ref("saved") });
			flow.unregisterFlowField("email");

			expect(flow.screenFieldNames.value).toEqual([]);
			expect(flow.screens.value.contact.answerFields).toEqual({});
			expect(flow.unregisterField).toHaveBeenCalledWith("email");
		});

		test("keeps a field's last answer after it unmounts from a screen the user has left", () => {
			const flow = createComposable();
			const displayValue = ref("saved");

			flow.registerScreen({ id: "first" });
			flow.registerScreen({ id: "second" });
			flow.registerFlowField({ name: "answer", displayValue });
			flow.activeScreenId.value = "second";
			flow.unregisterFlowField("answer");
			displayValue.value = "changed";

			expect(flow.screens.value.first.answerFields.answer.displayValue).toBe("saved");
			expect(flow.screenFieldNamesById.value.first).toEqual(["answer"]);
		});
	});

	describe("Completion and progress", () => {
		test("reports the active position, labels, completion, and remaining screens", () => {
			const flow = createComposable();

			flow.registerScreen({ id: "first", label: ref("Your details") });
			flow.registerScreen({ id: "second" });
			flow.registerScreen({ id: "third" });
			flow.markScreenComplete("first");
			flow.activeScreenId.value = "second";

			expect(flow.activeScreenIndex.value).toBe(1);
			expect(flow.haveActiveScreen.value).toBe(true);
			expect(flow.activeScreenProgressLabel.value).toBe("second");
			expect(flow.progressSlotProps.value).toEqual({
				current: { id: "second", label: "second" },
				completed: [{ id: "first", label: "Your details" }],
				remaining: [{ id: "third", label: "third" }],
			});
			expect(flow.isScreenComplete("first")).toBe(true);
			expect(flow.isLastScreen.value).toBe(false);
			expect(flow.canGoBack.value).toBe(true);
		});

		test("reports errors only for fields on the active screen", () => {
			const flow = createComposable();

			flow.registerScreen({ id: "first" });
			flow.registerFlowField({ name: "email" });
			flow.registerScreen({ id: "second" });
			flow.fieldErrorsFor.mockReturnValue(["Invalid email"]);
			flow.activeScreenId.value = "second";

			expect(flow.haveActiveScreenErrors.value).toBe(false);

			flow.activeScreenId.value = "first";

			expect(flow.haveActiveScreenErrors.value).toBe(true);
		});
	});
});

/**
 * Set up the screen list with stand-ins for form-flow's navigation and the
 * form, so tests can set the active screen and check what was called.
 * Navigating to a screen makes it active, as it does in form-flow.
 *
 * @returns  {object}
 *     The composable's return values, plus the refs and mock functions passed into it.
 */
function createComposable() {
	const activeScreenId = ref(null);
	const isShowingReview = ref(false);
	const fieldErrorsFor = vi.fn(() => []);
	const invalidatePendingNavigation = vi.fn();
	const registerField = vi.fn(() => "registered");
	const unregisterField = vi.fn();

	const navigateToScreen = vi.fn((screenId) => {
		activeScreenId.value = screenId;
	});

	return {
		activeScreenId,
		fieldErrorsFor,
		invalidatePendingNavigation,
		isShowingReview,
		navigateToScreen,
		registerField,
		unregisterField,
		...useFlowScreens({
			activeScreenId,
			fieldErrorsFor,
			invalidatePendingNavigation,
			isShowingReview,
			navigateToScreen,
			navigationReasons: {
				CONDITIONAL_RECOVERY: "conditional-screen-recovery",
				INITIAL_RENDER: "initial-render",
			},
			registerField,
			unregisterField,
		}),
	};
}
