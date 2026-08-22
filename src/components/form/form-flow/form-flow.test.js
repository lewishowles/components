import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";
import { flushPromises } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";

import FormField from "../form-field/form-field.vue";
import FormScreen from "../form-screen/form-screen.vue";
import FormFlow from "./form-flow.vue";

const mount = createMount(FormFlow);
const mountDeep = createDeepMount(FormFlow);

function screen(id, fieldName, label = fieldName) {
	return h(
		FormScreen,
		{ id },
		{
			default: () => h(FormField, { name: fieldName }, { default: () => label }),
		},
	);
}

function flowSlots() {
	return [screen("first", "first", "First answer"), screen("second", "second", "Second answer")];
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
					default: () =>
						screenIds.map((screenId) => {
							if (!state[screenId].value) {
								return null;
							}

							return screen(screenId, screenId);
						}),
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
	});

	describe("Navigation", () => {
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
	});

	describe("Submit", () => {
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
