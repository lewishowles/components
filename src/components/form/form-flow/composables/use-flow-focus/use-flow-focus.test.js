import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { computed, effectScope, nextTick, ref } from "vue";
import useFlowFocus from "./use-flow-focus.js";

// The effect scopes each test creates, stopped afterwards so watchers don't leak.
const scopes = [];

afterEach(() => {
	for (const scope of scopes) {
		scope.stop();
	}

	scopes.length = 0;
});

describe("useFlowFocus", () => {
	describe("Screen focus", () => {
		test("ignores an older focus request when a newer screen takes focus", async () => {
			const flow = createComposable();
			const firstFocus = flow.focusHooks.focusScreen("first");
			const secondFocus = flow.focusHooks.focusScreen("second");

			await Promise.all([firstFocus, secondFocus]);

			expect(flow.headings.first.focus).not.toHaveBeenCalled();
			expect(flow.headings.second.focus).toHaveBeenCalledOnce();
		});

		test("ignores a pending focus request after navigation invalidates it", async () => {
			const flow = createComposable();
			const pendingFocus = flow.focusHooks.focusScreen("first");

			flow.focusHooks.invalidatePendingFocus();

			await pendingFocus;

			expect(flow.headings.first.focus).not.toHaveBeenCalled();
		});

		test("focuses a queued field once its screen becomes active, then clears the request", async () => {
			const flow = createComposable();

			flow.formFields.email = {};
			flow.focusHooks.queueFieldFocus("email");
			flow.activeScreenId.value = "second";

			await nextTick();
			await nextTick();

			expect(flow.focusField).toHaveBeenCalledExactlyOnceWith("email");

			flow.activeScreenId.value = "first";

			await nextTick();
			await nextTick();

			expect(flow.focusField).toHaveBeenCalledOnce();
			expect(flow.headings.first.focus).toHaveBeenCalledOnce();
		});

		test("skips focus for the first registered screen and focuses the next screen", async () => {
			const flow = createComposable();

			flow.focusHooks.prepareScreenChange("initial-render");
			flow.activeScreenId.value = "first";

			await nextTick();
			await nextTick();

			expect(flow.headings.first.focus).not.toHaveBeenCalled();

			flow.focusHooks.prepareScreenChange("continue");
			flow.activeScreenId.value = "second";

			await nextTick();
			await nextTick();

			expect(flow.headings.second.focus).toHaveBeenCalledOnce();
		});

		test("focuses the error summary before review or screen content", async () => {
			const flow = createComposable();

			flow.haveAnyErrorSummary.value = true;
			flow.isShowingReview.value = true;

			await flow.focusHooks.focusScreen("first");

			expect(flow.errorSummaryElement.value.focus).toHaveBeenCalledOnce();
			expect(flow.reviewHeading.value.focus).not.toHaveBeenCalled();
			expect(flow.headings.first.focus).not.toHaveBeenCalled();
		});

		test("focuses the review heading when no summary is shown", async () => {
			const flow = createComposable();

			flow.isShowingReview.value = true;

			await flow.focusHooks.focusScreen("first");

			expect(flow.reviewHeading.value.focus).toHaveBeenCalledOnce();
			expect(flow.headings.first.focus).not.toHaveBeenCalled();
		});

		test("focuses the screen heading when no other target is requested", async () => {
			const flow = createComposable();

			await flow.focusHooks.focusScreen("first");

			expect(flow.headings.first.focus).toHaveBeenCalledOnce();
			expect(flow.errorSummaryElement.value.focus).not.toHaveBeenCalled();
		});

		test("shows flow errors and focuses their summary", async () => {
			const flow = createComposable();
			const errors = [{ field: "email", message: "Check your email" }];

			await flow.focusHooks.showFlowErrors(errors);

			expect(flow.flowErrorSummary.value).toEqual(errors);
			expect(flow.errorSummaryElement.value.focus).toHaveBeenCalledOnce();
		});
	});
});

/**
 * Create the focus state and template targets without mounting form-flow.
 *
 * @returns {object}
 *     The focus actions and targets used by each test.
 */
function createComposable() {
	const scope = effectScope();
	const activeScreenId = ref(null);
	const flowErrorSummary = ref([]);
	const formFields = {};
	const focusField = vi.fn();
	const haveAnyErrorSummary = ref(false);
	const isShowingReview = ref(false);

	const headings = {
		first: { focus: vi.fn() },
		second: { focus: vi.fn() },
	};

	const screens = ref({
		first: { element: { querySelector: () => headings.first } },
		second: { element: { querySelector: () => headings.second } },
	});

	const errorSummaryElement = ref({ focus: vi.fn() });
	const reviewHeading = ref({ focus: vi.fn() });
	const formFlow = ref({ getBoundingClientRect: () => ({ top: 100 }) });

	const options = {
		activeScreenId,
		errorSummaryElement,
		flowErrorSummary,
		focusField,
		formFields,
		formFlow,
		haveAnyErrorSummary: computed(() => haveAnyErrorSummary.value),
		isShowingReview,
		navigationReasons: { INITIAL_RENDER: "initial-render" },
		reviewHeading,
		screens,
	};

	scopes.push(scope);

	return {
		...options,
		haveAnyErrorSummary,
		headings,
		focusHooks: scope.run(() => useFlowFocus(options)),
	};
}
