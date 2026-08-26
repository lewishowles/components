import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";
import { flushPromises } from "@vue/test-utils";
import { defineComponent, h, inject, nextTick, ref } from "vue";

import FormField from "../form-field/form-field.vue";
import FormScreen from "../form-screen/form-screen.vue";
import StepIndicator from "../../messaging/step-indicator/step-indicator.vue";
import FormFlow from "./form-flow.vue";

const mount = createMount(FormFlow);
const mountDeep = createDeepMount(FormFlow);

function screen(id, fieldName, label = fieldName, screenProps = {}) {
	return h(
		FormScreen,
		{ id, key: id, ...screenProps },
		{
			default: () => h(FormField, { name: fieldName }, { default: () => label }),
		},
	);
}

// Create a promise whose resolution the test controls, allowing async behaviour
// to be tested.
function createDeferred() {
	let resolve;

	const promise = new Promise((deferredResolve) => {
		resolve = deferredResolve;
	});

	return { promise, resolve };
}

function flowSlots() {
	return [screen("first", "first", "First answer"), screen("second", "second", "Second answer")];
}

function titledScreen(id, title) {
	return h(
		FormScreen,
		{ id, key: id },
		{
			default: () => h(FormField, { name: id }, { default: () => `${title} answer` }),
			title: () => title,
		},
	);
}

// Render screen completion state for test assertions.
function createCompletionStateOutput(screenIds) {
	return defineComponent({
		setup() {
			const formFlow = inject("form-flow", {});

			return () =>
				h("output", {
					"data-test": "completion-state",
					...Object.fromEntries(
						screenIds.map((screenId) => [
							`data-completed-${screenId}`,
							String(formFlow.isScreenComplete?.(screenId) ?? false),
						]),
					),
				});
		},
	});
}

/**
 * Create a flow harness whose screen visibility can change during a test.
 *
 * @param  {object}  state
 *     Reactive visibility flags keyed by screen ID.
 * @param  {string[]}  screenIds
 *     Screen IDs to render in order.
 * @param  {object}  props
 *     Props and listeners to pass to form-flow.
 * @returns {object}
 *     The conditional flow harness component.
 */
function createConditionalFlow(state, screenIds, props = {}) {
	return defineComponent({
		setup() {
			return () =>
				h(FormFlow, props, {
					default: () => [
						...screenIds.map((screenId) => {
							if (!state[screenId].value) {
								return null;
							}

							return screen(screenId, screenId);
						}),
						h(createCompletionStateOutput(screenIds)),
					],
				});
		},
	});
}

/**
 * Mount a flow harness with real screen and field components.
 *
 * @param  {object}  state
 *     Reactive visibility flags keyed by screen ID.
 * @param  {string[]}  screenIds
 *     Screen IDs to render in order.
 * @param  {object}  props
 *     Props and listeners to pass to form-flow.
 * @returns {object}
 *     The mounted flow wrapper.
 */
function mountConditionalFlow(state, screenIds, props) {
	return createDeepMount(createConditionalFlow(state, screenIds, props))();
}

describe("form-flow", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("renders the first registered screen only", async () => {
			const wrapper = mountDeep({ slots: { default: flowSlots } });

			await nextTick();

			expect(wrapper.findAll('[data-test="form-screen"]')).toHaveLength(1);
			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(false);
		});

		test("passes submit and error state to the default slot", async () => {
			const defaultSlot = vi.fn(() => screen("first", "first"));
			const wrapper = mountDeep({ slots: { default: defaultSlot } });

			await nextTick();

			expect(defaultSlot.mock.calls.at(-1)[0]).toEqual({
				isSubmitting: false,
				hasErrors: false,
			});
			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
		});

		test("passes current, completed, and remaining screens to the progress slot", async () => {
			const progressSlot = vi.fn(() => "Custom progress");

			const wrapper = mountDeep({
				slots: {
					default: flowSlots,
					progress: progressSlot,
				},
			});

			await nextTick();

			expect(progressSlot.mock.calls.at(-1)[0]).toEqual({
				current: { id: "first", label: "first" },
				completed: [],
				remaining: [{ id: "second", label: "second" }],
			});
			expect(wrapper.text()).toContain("Custom progress");
		});

		test("renders default step progress with the current screen label and position", async () => {
			const wrapper = mountDeep({
				slots: {
					default: () => [
						titledScreen("first", "First details"),
						titledScreen("second", "Second details"),
					],
				},
			});

			await nextTick();

			const indicator = wrapper.findComponent(StepIndicator);

			expect(indicator.props()).toMatchObject({ currentStep: 1, stepCount: 2 });
			expect(indicator.get('[data-test="step-indicator-label"]').text()).toBe("First details");

			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(indicator.props()).toMatchObject({ currentStep: 2, stepCount: 2 });
			expect(indicator.get('[data-test="step-indicator-label"]').text()).toBe("Second details");
		});

		test("falls back to the active screen ID when no progress label or title is supplied", async () => {
			const wrapper = mountDeep({ slots: { default: flowSlots } });

			await nextTick();

			const indicator = wrapper.findComponent(StepIndicator);

			expect(indicator.props()).toMatchObject({ currentStep: 1, stepCount: 2 });
			expect(indicator.get('[data-test="step-indicator-label"]').text()).toBe("first");
		});
	});

	describe("Navigation", () => {
		test("marks the last screen completed after a successful final submit", async () => {
			const wrapper = mountDeep({
				props: { modelValue: { first: "ready", second: "later" } },
				slots: {
					default: () => [...flowSlots(), h(createCompletionStateOutput(["first", "second"]))],
				},
			});

			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(
				wrapper.get('[data-test="completion-state"]').attributes("data-completed-second"),
			).toBe("true");
		});

		test("keeps a completed screen marked after moving back", async () => {
			const wrapper = mountDeep({
				props: { modelValue: { first: "ready", second: "later" } },
				slots: {
					default: () => [...flowSlots(), h(createCompletionStateOutput(["first", "second"]))],
				},
			});

			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(wrapper.get('[data-test="completion-state"]').attributes("data-completed-first")).toBe(
				"true",
			);

			await wrapper.get('[data-test="form-flow-back-button"]').trigger("click");
			await nextTick();

			expect(wrapper.get('[data-test="completion-state"]').attributes("data-completed-first")).toBe(
				"true",
			);
		});

		test("clears completion from an edited screen and later screens while retaining values", async () => {
			const screens = [
				screen("first", "first"),
				screen("second", "second"),
				screen("third", "third"),
			];

			const wrapper = mountDeep({
				props: { modelValue: { first: "one", second: "two", third: "three" } },
				slots: {
					default: () => [...screens, h(createCompletionStateOutput(["first", "second", "third"]))],
				},
			});

			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow-back-button"]').trigger("click");
			await nextTick();
			await wrapper.get('[data-test="form-flow-back-button"]').trigger("click");
			await nextTick();
			await wrapper.get('[data-screen-id="first"] input').setValue("changed");
			await nextTick();

			expect(wrapper.get('[data-test="completion-state"]').attributes("data-completed-first")).toBe(
				"false",
			);
			expect(
				wrapper.get('[data-test="completion-state"]').attributes("data-completed-second"),
			).toBe("false");
			expect(wrapper.get('[data-test="completion-state"]').attributes("data-completed-third")).toBe(
				"false",
			);
			expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([
				{ first: "changed", second: "two", third: "three" },
			]);
		});

		test("clears a conditional screen's completion when it disappears and returns", async () => {
			const state = { first: ref(true), second: ref(true), third: ref(true) };

			const wrapper = mountConditionalFlow(state, ["first", "second", "third"], {
				modelValue: { first: "one", second: "two", third: "three" },
			});

			await nextTick();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			state.second.value = false;
			await nextTick();

			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(false);

			state.second.value = true;
			await nextTick();
			await flushPromises();

			expect(
				wrapper.get('[data-test="completion-state"]').attributes("data-completed-second"),
			).toBe("false");

			await wrapper.get('[data-test="form-flow-back-button"]').trigger("click");
			await nextTick();

			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(true);
		});

		test("warns and shows an empty state when mounted without screens", async () => {
			const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

			try {
				const wrapper = mountDeep({ slots: { default: () => [] } });

				await nextTick();

				expect(wrapper.find('[data-test="form-flow-empty"]').text()).toContain(
					"No screens are available.",
				);
				expect(warning).toHaveBeenCalledWith("[form-flow] No visible screens remain.");
			} finally {
				warning.mockRestore();
			}
		});

		test("moves to the next visible screen when the active screen is removed", async () => {
			const state = {
				first: ref(true),
				second: ref(true),
				third: ref(true),
			};

			const wrapper = mountConditionalFlow(state, ["first", "second", "third"]);

			await nextTick();

			state.first.value = false;
			await nextTick();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(false);
			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(true);
		});

		test("moves to the previous visible screen when no later screen remains", async () => {
			const state = { first: ref(true), second: ref(true) };
			const wrapper = mountConditionalFlow(state, ["first", "second"]);

			await nextTick();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			state.second.value = false;
			await nextTick();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(false);
		});

		test("shows an empty state and prevents submission when all screens are removed", async () => {
			const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
			const onSubmit = vi.fn();
			const state = { first: ref(true) };
			const wrapper = mountConditionalFlow(state, ["first"], { onSubmit });

			try {
				await nextTick();

				state.first.value = false;
				await nextTick();

				await wrapper.get('[data-test="form-flow"]').trigger("submit");
				await flushPromises();

				expect(wrapper.find('[data-test="form-flow-empty"]').text()).toContain(
					"No screens are available.",
				);
				expect(wrapper.find('[data-test="form-flow-continue-button"]').exists()).toBe(false);
				expect(onSubmit).not.toHaveBeenCalled();
				expect(warning).toHaveBeenCalledWith("[form-flow] No visible screens remain.");
			} finally {
				warning.mockRestore();
			}
		});

		test("moves forward after the current screen validates", async () => {
			const wrapper = mountDeep({
				props: {
					modelValue: { first: "ready", second: "later" },
					rules: { first: [{ rule: "required", message: "First answer is required" }] },
				},
				slots: { default: flowSlots },
			});

			await flushPromises();

			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(false);
			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(true);
			expect(wrapper.find('[data-test="form-flow-error-summary"]').attributes("style")).toContain(
				"display: none",
			);
		});

		test("ignores validation errors for later screens", async () => {
			const wrapper = mountDeep({
				props: {
					modelValue: { first: "ready", second: "" },
					rules: {
						first: [{ rule: "required", message: "First answer is required" }],
						second: [{ rule: "required", message: "Second answer is required" }],
					},
				},
				slots: { default: flowSlots },
			});

			await flushPromises();

			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(false);
			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(true);
		});

		test("moves back without validating the screen being left", async () => {
			const wrapper = mountDeep({
				props: {
					modelValue: { first: "ready", second: "" },
					rules: { second: [{ rule: "required", message: "Second answer is required" }] },
				},
				slots: { default: flowSlots },
			});

			await flushPromises();

			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow-back-button"]').trigger("click");
			await nextTick();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
			expect(wrapper.find('[data-test="form-flow-error-summary"]').attributes("style")).toContain(
				"display: none",
			);
		});

		test("preserves a field value and error after Back remounts a screen", async () => {
			const wrapper = mountDeep({
				props: {
					modelValue: { first: "ready", second: "later" },
					rules: { first: [{ rule: "required", message: "First answer is required" }] },
				},
				slots: { default: flowSlots },
			});

			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.setProps({ fieldErrors: { first: "First answer is required" } });
			await wrapper.get('[data-test="form-flow-back-button"]').trigger("click");
			await nextTick();

			expect(wrapper.get('[data-screen-id="first"] input').element.value).toBe("ready");
			expect(wrapper.get('[data-screen-id="first"]').text()).toContain("First answer is required");
		});
	});

	describe("Automatic progression", () => {
		test("advances after a direct change to the configured field", async () => {
			const wrapper = mountDeep({
				props: { modelValue: { first: "", second: "" } },
				slots: {
					default: () => [
						screen("first", "first", "First answer", { autoAdvance: "first" }),
						screen("second", "second"),
					],
				},
			});

			await flushPromises();
			await wrapper.get('[data-screen-id="first"] input').setValue("changed");
			await flushPromises();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(false);
			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(true);
		});

		test("does not advance from seeded or programmatic field values", async () => {
			const fieldValue = ref("seeded");

			const controlledScreen = defineComponent({
				setup() {
					return () =>
						h(
							FormScreen,
							{ id: "first", autoAdvance: "first" },
							{
								default: () => h(FormField, { name: "first", modelValue: fieldValue.value }),
							},
						);
				},
			});

			const wrapper = mountDeep({
				props: { modelValue: { first: "seeded", second: "" } },
				slots: {
					default: () => [h(controlledScreen), screen("second", "second")],
				},
			});

			await flushPromises();
			fieldValue.value = "programmatic";
			await nextTick();
			await flushPromises();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
		});

		test("starts validation for each change and ignores a stale changed value", async () => {
			const pendingValidations = [];

			const validate = vi.fn(() => {
				const deferred = createDeferred();

				pendingValidations.push(deferred);

				return deferred.promise;
			});

			const wrapper = mountDeep({
				props: {
					modelValue: { first: "ready", second: "" },
					rules: { first: [validate] },
				},
				slots: {
					default: () => [
						screen("first", "first", "First answer", { autoAdvance: "first" }),
						screen("second", "second"),
					],
				},
			});

			await flushPromises();
			const input = wrapper.get('[data-screen-id="first"] input');

			await input.setValue("first change");
			await nextTick();
			await flushPromises();
			expect(validate).toHaveBeenCalledTimes(1);

			await input.setValue("latest change");
			await nextTick();
			await flushPromises();

			expect(validate).toHaveBeenCalledTimes(2);
			pendingValidations[0].resolve(true);
			await flushPromises();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
			expect(validate).toHaveBeenCalledTimes(2);
			pendingValidations[1].resolve(true);
			await flushPromises();

			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(true);
		});

		test("keeps the current screen and exposes errors when validation fails", async () => {
			const wrapper = mountDeep({
				props: {
					modelValue: { first: "ready", second: "" },
					rules: {
						first: [{ rule: "required", message: "First answer is required" }],
					},
				},
				slots: {
					default: () => [
						screen("first", "first", "First answer", { autoAdvance: "first" }),
						screen("second", "second"),
					],
				},
			});

			await flushPromises();
			await wrapper.get('[data-screen-id="first"] input').setValue("");
			await flushPromises();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(false);
			expect(wrapper.text()).toContain("First answer is required");
		});
	});

	describe("Validation", () => {
		test("blocks Continue on a current-screen error", async () => {
			const wrapper = mountDeep({
				props: {
					modelValue: { first: "", second: "ready" },
					rules: { first: [{ rule: "required", message: "First answer is required" }] },
				},
				slots: { default: flowSlots },
			});

			await flushPromises();

			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
			expect(wrapper.text()).toContain("First answer is required");
		});

		test("passes complete form data to rules while validating only the current screen", async () => {
			const wrapper = mountDeep({
				props: {
					modelValue: { confirmation: "one", password: "two" },
					rules: {
						confirmation: [{ rule: "same", field: "password", message: "Passwords must match" }],
					},
				},
				slots: {
					default: () => [
						h(
							FormScreen,
							{ id: "confirmation" },
							{
								default: () => h(FormField, { name: "confirmation" }, { default: () => "Confirm" }),
							},
						),
						h(
							FormScreen,
							{ id: "password" },
							{
								default: () => h(FormField, { name: "password" }, { default: () => "Password" }),
							},
						),
					],
				},
			});

			await flushPromises();

			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(wrapper.find('[data-screen-id="confirmation"]').exists()).toBe(true);
			expect(wrapper.text()).toContain("Passwords must match");
			expect(wrapper.find('[data-screen-id="password"]').exists()).toBe(false);
		});

		test("shows a root validation error in the flow summary", async () => {
			const onSubmit = vi.fn();

			const wrapper = mountDeep({
				props: {
					modelValue: { first: "ready" },
					onSubmit,
					schema: {
						"~standard": {
							validate: vi.fn().mockResolvedValue({
								issues: [{ message: "The form is not ready to submit", path: [] }],
							}),
						},
					},
				},
				slots: { default: () => screen("first", "first") },
			});

			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(onSubmit).not.toHaveBeenCalled();
			expect(wrapper.find('[data-screen-id="first"]').exists()).toBe(true);
			expect(wrapper.find('[data-test="form-flow-error-summary"]').text()).toContain(
				"The form is not ready to submit",
			);
		});
	});

	describe("Submit", () => {
		test("routes final errors to the first visible screen with an error", async () => {
			const secondRule = vi
				.fn()
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(true)
				.mockReturnValue(false);

			const wrapper = mountDeep({
				props: {
					modelValue: { first: "ready", second: "ready", third: "" },
					rules: {
						second: [{ rule: "custom", validate: secondRule, message: "Second is invalid" }],
						third: [{ rule: "required", message: "Third is required" }],
					},
				},
				slots: {
					default: () => [
						screen("first", "first"),
						screen("second", "second"),
						screen("third", "third"),
					],
				},
			});

			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(true);
			expect(wrapper.find('[data-screen-id="third"]').exists()).toBe(false);
			expect(wrapper.text()).toContain("Second is invalid");
		});

		test("shows a removed screen's final error in the flow summary", async () => {
			const state = {
				first: ref(true),
				second: ref(true),
				third: ref(true),
			};

			const wrapper = mountConditionalFlow(state, ["first", "second", "third"], {
				modelValue: { first: "ready", second: "ready", third: "" },
				rules: { third: [{ rule: "required", message: "Third is required" }] },
			});

			await nextTick();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			state.third.value = false;
			await nextTick();
			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(wrapper.find('[data-screen-id="second"]').exists()).toBe(true);
			expect(wrapper.find('[data-test="form-flow-error-summary"]').text()).toContain(
				"Third is required",
			);
		});

		test("emits submit when no submit listener is attached", async () => {
			const wrapper = mountDeep({
				props: { modelValue: { first: "ready" } },
				slots: { default: () => screen("first", "first") },
			});

			await flushPromises();

			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(wrapper.emitted("submit")).toEqual([[{ first: "ready" }]]);
		});

		test("emits submit with the final screen data", async () => {
			const onSubmit = vi.fn();

			const wrapper = mountDeep({
				props: { modelValue: { first: "ready" }, onSubmit },
				slots: { default: () => screen("first", "first") },
			});

			await flushPromises();

			await wrapper.get('[data-test="form-flow"]').trigger("submit");
			await flushPromises();

			expect(onSubmit).toHaveBeenCalledWith({ first: "ready" });
			expect(onSubmit).toHaveBeenCalledTimes(1);
		});
	});

	describe("Expose", () => {
		test("exposes submit state and resetSubmitButton", () => {
			const wrapper = mount();

			expect(wrapper.vm.isSubmitting).toBe(false);
			expect(wrapper.vm.isDirty).toBe(false);
			expect(wrapper.vm.resetSubmitButton).toBeTypeOf("function");
		});
	});
});
