import { defineComponent, h, nextTick, ref } from "vue";
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
			fieldTypes: {
				type: Object,
				default: () => ({}),
			},
			fields: {
				type: Object,
				default: () => ({}),
			},
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
			rules: {
				type: Object,
				default: () => ({}),
			},
			recordId: {
				type: [String, Number],
				default: null,
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
	describe("Mapped rules", () => {
		test("runs prop rules before mapped rules for a registered field", async () => {
			const { instance } = mountFormHost({
				props: {
					fields: { name: { rules: [{ rule: "required", message: "Map rule" }] } },
					rules: { name: [{ rule: "required", message: "Prop rule" }] },
				},
			});

			instance.registerField({ name: "name", id: "name-id" });

			await instance.validate({ focus: false });

			expect(instance.formLevelErrors.value.name).toEqual(["Prop rule", "Map rule"]);
		});
	});

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
			expect(instance.formContext.formData).toBe(instance.formData);
			expect(instance.formContext.isCompact.value).toBe(true);
			expect(instance.formContext.isReadonly.value).toBe(true);
			expect(instance.haveActionsLabel.value).toBe(true);
			expect(instance.haveSubmitButtonLabel.value).toBe(true);
			expect(instance.haveSubmitErrorsSlot.value).toBe(true);
		});
	});

	describe("Initial data", () => {
		test("uses a mapped valueType without fieldTypes for initial and submitted values", async () => {
			const onSubmit = vi.fn();

			const { instance } = mountFormHost({
				formOptions: { includeUnregisteredFields: true },
				props: {
					fields: { age: { valueType: "nullable-number" } },
					initialData: { age: 12 },
					onSubmit,
				},
			});

			expect(instance.formData.value.age).toBe("12");

			await instance.handleFormSubmit();

			expect(onSubmit).toHaveBeenCalledWith({ age: 12 });
		});

		test("uses mapped valueType over fieldTypes for initial and submitted values", async () => {
			const onSubmit = vi.fn();

			const { instance } = mountFormHost({
				formOptions: { includeUnregisteredFields: true },
				props: {
					fieldTypes: { age: "nullable-number" },
					fields: { age: { valueType: "nullable-string" } },
					initialData: { age: "12" },
					onSubmit,
				},
			});

			expect(instance.formData.value.age).toBe("12");

			await instance.handleFormSubmit();

			expect(onSubmit).toHaveBeenCalledWith({ age: "12" });
		});

		test("returns current settings for a named field", async () => {
			const { instance, wrapper } = mountFormHost({
				props: { fields: { choice: { options: ["First"] } } },
			});

			expect(instance.formContext.fieldSettingsFor("choice")).toEqual({ options: ["First"] });
			expect(instance.formContext.fieldSettingsFor("missing")).toEqual({});

			await wrapper.setProps({ fields: { choice: { options: ["Second"] } } });

			expect(instance.formContext.fieldSettingsFor("choice")).toEqual({ options: ["Second"] });
		});

		test("emits synchronously available initialData through v-model", () => {
			const { wrapper } = mountFormHost({
				props: { initialData: { name: "Alice" } },
			});

			expect(wrapper.emitted("update:modelValue")).toEqual([[{ name: "Alice" }]]);
		});

		test("fills absent and undefined values without replacing null or empty strings", () => {
			const { instance, wrapper } = mountFormHost({
				props: {
					fields: {
						absent: { default: "New" },
						undefinedValue: { default: ref("Filled") },
						nullValue: { default: "Ignored" },
						emptyValue: { default: "Ignored" },
					},
					modelValue: { undefinedValue: undefined, nullValue: null, emptyValue: "" },
				},
			});

			expect(instance.formData.value).toEqual({
				absent: "New",
				undefinedValue: "Filled",
				nullValue: null,
				emptyValue: "",
			});
			expect(instance.isDirty.value).toBe(false);
			expect(wrapper.emitted("update:modelValue")).toEqual([[instance.formData.value]]);
		});

		test("does not emit for a model-only seed without an added default", () => {
			const { wrapper } = mountFormHost({
				props: {
					fields: { name: { default: "Ignored" } },
					modelValue: { name: "Alice" },
				},
			});

			expect(wrapper.emitted("update:modelValue")).toBeUndefined();
		});

		test("waits for async initialData before applying defaults", async () => {
			const source = ref(null);

			const { instance, wrapper } = mountFormHost({
				props: {
					fields: { name: { default: "New" } },
					initialData: () => source.value,
					modelValue: { name: "Old" },
				},
			});

			expect(instance.formData.value).toEqual({});
			expect(wrapper.emitted("update:modelValue")).toBeUndefined();

			source.value = { age: 20 };
			await nextTick();

			expect(instance.formData.value).toEqual({ age: 20, name: "New" });
			expect(instance.isDirty.value).toBe(false);
			expect(wrapper.emitted("update:modelValue")).toEqual([[{ age: 20, name: "New" }]]);
		});

		test("applies defaults when a new record reseeds a clean form", async () => {
			const source = ref({ name: "Alice" });

			const { instance, wrapper } = mountFormHost({
				props: {
					fields: { colour: { default: "Blue" } },
					initialData: () => source.value,
					recordId: 1,
				},
			});

			expect(instance.formData.value).toEqual({ name: "Alice", colour: "Blue" });

			await wrapper.setProps({ recordId: 2 });
			source.value = { name: "Bob" };
			await nextTick();

			expect(instance.formData.value).toEqual({ name: "Bob", colour: "Blue" });
			expect(instance.isDirty.value).toBe(false);
		});

		test("waits for a new source after fields and defaults change during a record reseed", async () => {
			const colour = ref("Blue");
			const source = ref({ name: "Alice" });

			const { instance, wrapper } = mountFormHost({
				props: {
					fields: { colour: { default: colour } },
					initialData: () => source.value,
					recordId: 1,
				},
			});

			expect(instance.formData.value).toEqual({ name: "Alice", colour: "Blue" });

			await wrapper.setProps({ recordId: 2 });
			await wrapper.setProps({ fields: { colour: { default: colour } } });

			expect(instance.formData.value).toEqual({ name: "Alice", colour: "Blue" });

			colour.value = "Green";
			await nextTick();

			expect(instance.formData.value).toEqual({ name: "Alice", colour: "Blue" });

			source.value = { name: "Bob" };
			await nextTick();

			expect(instance.formData.value).toEqual({ name: "Bob", colour: "Green" });
			expect(instance.isDirty.value).toBe(false);
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
