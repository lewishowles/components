import { defineComponent, h, ref } from "vue";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { mount } from "@vue/test-utils";

import { useFormHost } from "./use-form-host.js";

// Mounted hosts ensure the composable reads the same component instance data as its callers.
const mountedWrappers = [];

/**
 * Mount useFormHost with the props and slot bindings used by a form host.
 *
 * @param  {object}  [options]
 *     Props, slots, and useForm options for the mounted host.
 * @returns  {object}
 *     The mounted wrapper and its form-host instance.
 */
function mountFormHost(options = {}) {
	let instance;

	const component = defineComponent({
		props: {
			compact: {
				type: Boolean,
				default: false,
			},
			initialData: {
				type: [Object, Function],
				default: null,
			},
			modelValue: {
				type: Object,
				default: () => ({}),
			},
			readonly: {
				type: Boolean,
				default: false,
			},
			status: {
				type: Object,
				default: null,
			},
		},
		emits: ["submit", "update:modelValue"],
		setup(props, { emit }) {
			instance = useFormHost(props, emit, {
				errorSummaryElement: ref(null),
				generalErrorsElement: ref(null),
				submitButtonRef: ref(null),
				unsavedChangesGuard: false,
				...options.formOptions,
			});

			return () => h("div");
		},
	});

	const wrapper = mount(component, {
		props: options.props,
		slots: options.slots,
	});

	mountedWrappers.push(wrapper);

	return { instance, wrapper };
}

afterEach(() => {
	mountedWrappers.splice(0).forEach((wrapper) => wrapper.unmount());
});

describe("useFormHost", () => {
	describe("Initialisation", () => {
		test("returns the generic form context and submit presentation flags", () => {
			const { instance } = mountFormHost({
				props: { compact: true, readonly: true },
				slots: {
					"actions-label": "Form actions",
					"submit-button-label": "Submit form",
					"submit-errors": "Something went wrong",
				},
			});

			expect(instance.formContext.fieldErrorsFor).toBeTypeOf("function");
			expect(instance.formContext.isCompact.value).toBe(true);
			expect(instance.formContext.isReadonly.value).toBe(true);
			expect(instance.haveActionsLabel.value).toBe(true);
			expect(instance.haveSubmitButtonLabel.value).toBe(true);
			expect(instance.haveSubmitErrorsSlot.value).toBe(true);
		});
	});

	describe("Initial data", () => {
		test("emits synchronously available initialData through v-model", () => {
			const { wrapper } = mountFormHost({
				props: { initialData: { name: "Alice" } },
			});

			expect(wrapper.emitted("update:modelValue")).toEqual([[{ name: "Alice" }]]);
		});
	});

	describe("Submission", () => {
		test("awaits direct submit listeners", async () => {
			const onSubmit = vi.fn(() => Promise.resolve("saved"));

			const { instance } = mountFormHost({
				formOptions: { includeUnregisteredFields: true },
				props: { modelValue: { name: "Alice" }, onSubmit },
			});

			await instance.handleFormSubmit();

			expect(onSubmit).toHaveBeenCalledWith({ name: "Alice" });
		});

		test("returns undefined without a submit listener or fallback", async () => {
			const { instance } = mountFormHost();

			await expect(instance.handleFormSubmit()).resolves.toBeUndefined();
		});

		test("uses the empty-submit fallback when no listener is registered", async () => {
			const handleEmptySubmit = vi.fn(() => "saved");
			const onSuccess = vi.fn();

			const { instance } = mountFormHost({
				formOptions: {
					handleEmptySubmit,
					includeUnregisteredFields: true,
					onSuccess,
				},
				props: { modelValue: { name: "Alice" } },
			});

			await instance.handleFormSubmit();

			expect(handleEmptySubmit).toHaveBeenCalledWith({ name: "Alice" });
			expect(onSuccess).toHaveBeenCalledWith("saved", { name: "Alice" });
		});
	});
});
