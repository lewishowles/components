import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { defineComponent, h, nextTick, ref } from "vue";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import FormButtonGroup from "@/components/form/form-button-group/form-button-group.vue";
import FormCheckbox from "@/components/form/form-checkbox/form-checkbox.vue";
import FormComboBox from "@/components/form/form-combo-box/form-combo-box.vue";
import FormField from "./form-field.vue";
import FormFile from "@/components/form/form-file/form-file.vue";
import FormInput from "@/components/form/form-input/form-input.vue";
import FormRadioGroup from "@/components/form/form-radio-group/form-radio-group.vue";
import FormTextarea from "@/components/form/form-textarea/form-textarea.vue";

const fieldErrorsForMock = vi.fn(() => []);
const registerFieldMock = vi.fn();
const unregisterFieldMock = vi.fn();
const updateFieldValueMock = vi.fn();
const defaultProps = { name: "username" };

const provide = {
	form: {
		fieldErrorsFor: fieldErrorsForMock,
		registerField: registerFieldMock,
		unregisterField: unregisterFieldMock,
		updateFieldValue: updateFieldValueMock,
	},
};

const mount = createMount(FormField, { props: defaultProps, global: { provide } });
const mountDeep = createDeepMount(FormField, { props: defaultProps, global: { provide } });

const missingNameWarning = "[form-field] A non-empty `name` is required inside `form-wrapper`.";
const unknownTypeWarning = '[form-field] Unknown type "unknown". Falling back to "text".';

/**
 * Stub the development flag and silence console.warn, so a test can check
 * development-only diagnostic behaviour without real warning output.
 *
 * @param  {boolean}  isDevelopment
 * @returns  {object}
 *     The console.warn spy, for call assertions.
 */
function stubDevelopmentWarning(isDevelopment) {
	vi.stubEnv("DEV", isDevelopment);

	return vi.spyOn(console, "warn").mockImplementation(() => {});
}

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
});

describe("form-field", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("should register with a parent `form-wrapper`", () => {
			mount();

			expect(registerFieldMock).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "username",
					id: expect.any(String),
				}),
			);
		});

		test("should register with the child's focusId when available", () => {
			mountDeep({ props: { type: "date", modelValue: { day: null, month: null, year: null } } });

			const registeredId = registerFieldMock.mock.calls.at(-1)?.[0]?.id;

			expect(registeredId).toMatch(/-day$/);
		});

		test("should register a label and a display value accessor", () => {
			mount({ props: { modelValue: "Lewis" }, slots: { default: "Username" } });

			const field = registerFieldMock.mock.calls.at(-1)?.[0];

			expect(field.label).toBe("Username");
			expect(field.displayValue.value).toBe("Lewis");
		});

		test("should register a custom answer-summary slot", () => {
			const answerSummary = vi.fn();

			mount({
				slots: {
					"answer-summary": answerSummary,
					default: "Username",
				},
			});

			const field = registerFieldMock.mock.calls.at(-1)?.[0];

			expect(field.answerSummary).toBeTypeOf("function");
		});

		test.for([
			["a string", "Lewis", "Lewis"],
			["a number", 42, 42],
			["true", true, true],
			["false", false, false],
		])("should expose %s values as-is", ([, value, displayValue]) => {
			mount({ props: { modelValue: value }, slots: { default: "Answer" } });

			const field = registerFieldMock.mock.calls.at(-1)?.[0];

			expect(field.displayValue.value).toBe(displayValue);
		});

		test.for([
			["an empty string", ""],
			["null", null],
			["an object", {}],
			["an array", ["one"]],
		])("should not expose %s", ([, value]) => {
			mount({ props: { modelValue: value }, slots: { default: "Answer" } });

			const field = registerFieldMock.mock.calls.at(-1)?.[0];

			expect(field.displayValue.value).toBeUndefined();
		});

		test.for(["password", "file"])("should not expose %s values", (type) => {
			mount({ props: { modelValue: "hidden", type }, slots: { default: "Secret" } });

			const field = registerFieldMock.mock.calls.at(-1)?.[0];

			expect(field.displayValue.value).toBeUndefined();
		});

		test("should resolve a selected option to its displayed label", () => {
			mount({
				props: {
					labelKey: "name",
					options: [{ id: "pilot", name: "Amelia Earhart" }],
					type: "select",
					valueKey: "id",
					modelValue: "pilot",
				},
				slots: { default: "Pilot" },
			});

			const field = registerFieldMock.mock.calls.at(-1)?.[0];

			expect(field.displayValue.value).toBe("Amelia Earhart");
		});

		test("should resolve multiple selected options to displayed labels", () => {
			mount({
				props: {
					modelValue: ["email", "sms"],
					options: [
						{ label: "Email", value: "email" },
						{ label: "SMS", value: "sms" },
					],
					type: "checkbox-group",
				},
				slots: { default: "Contact methods" },
			});

			const field = registerFieldMock.mock.calls.at(-1)?.[0];

			expect(field.displayValue.value).toBe("Email, SMS");
		});

		test("should not expose an option value when its label cannot be resolved", () => {
			mount({
				props: {
					modelValue: "unknown",
					options: [{ label: "Email", value: "email" }],
					type: "select",
				},
				slots: {
					default: "Contact method",
				},
			});

			const field = registerFieldMock.mock.calls.at(-1)?.[0];

			expect(field.displayValue.value).toBeUndefined();
		});

		test("should unregister from a parent form when unmounted", () => {
			const wrapper = mount();

			wrapper.unmount();

			expect(unregisterFieldMock).toHaveBeenCalledWith("username");
		});

		test("should not throw when a parent form has no unregister function", () => {
			const mountWithoutUnregister = createMount(FormField, {
				props: defaultProps,
				global: {
					provide: {
						form: {
							fieldErrorsFor: fieldErrorsForMock,
							registerField: registerFieldMock,
							updateFieldValue: updateFieldValueMock,
						},
					},
				},
			});

			const wrapper = mountWithoutUnregister();

			expect(() => wrapper.unmount()).not.toThrow();
		});

		test("should move its registration when its name changes", async () => {
			const wrapper = mount();

			await wrapper.setProps({ name: "displayName" });

			expect(unregisterFieldMock).toHaveBeenCalledWith("username");
			expect(registerFieldMock).toHaveBeenLastCalledWith(
				expect.objectContaining({
					name: "displayName",
					id: expect.any(String),
				}),
			);
		});

		test("should unregister without re-registering when its name becomes null", async () => {
			const wrapper = mount();

			await wrapper.setProps({ name: null });

			expect(unregisterFieldMock).toHaveBeenCalledWith("username");
			expect(registerFieldMock).toHaveBeenCalledTimes(1);
		});

		test("should unregister without re-registering when its name becomes empty", async () => {
			const wrapper = mount();

			await wrapper.setProps({ name: "" });

			expect(unregisterFieldMock).toHaveBeenCalledWith("username");
			expect(registerFieldMock).toHaveBeenCalledTimes(1);
		});
	});

	describe("Form data", () => {
		test("updates the displayed value when parent form data changes", async () => {
			const formData = ref({ username: "initial" });

			const wrapper = mountDeep({
				props: { modelValue: "initial" },
				global: {
					provide: {
						form: { ...provide.form, formData },
					},
				},
			});

			formData.value.username = "updated";
			await nextTick();

			expect(wrapper.findComponent(FormInput).props("modelValue")).toBe("updated");
		});

		test.for([
			["a primitive value", "text", "initial", "updated"],
			[
				"an object-shaped date value",
				"date",
				{ day: 1, month: 1, year: 2026 },
				{ day: 2, month: 1, year: 2026 },
			],
		])("does not write %s back to the parent form twice", async ([, type, initialValue, value]) => {
			const formData = ref({ username: initialValue });

			updateFieldValueMock.mockImplementationOnce((name, updatedValue) => {
				formData.value[name] = updatedValue;
			});

			const wrapper = mount({
				props: { modelValue: initialValue, type },
				global: {
					provide: {
						form: { ...provide.form, formData },
					},
				},
			});

			await wrapper.setProps({ modelValue: value });
			await nextTick();

			expect(updateFieldValueMock).toHaveBeenCalledTimes(1);
			expect(updateFieldValueMock).toHaveBeenCalledWith("username", value);
		});

		test("ignores form data changes without a parent form", async () => {
			const formData = ref({ username: "initial" });

			const wrapper = mountDeep({
				props: { modelValue: "initial" },
				global: {
					provide: {
						form: { formData, registerField: null },
					},
				},
			});

			formData.value.username = "updated";
			await nextTick();

			expect(wrapper.findComponent(FormInput).props("modelValue")).toBe("initial");
		});

		test("uses the renamed key's existing value without rewriting the old key", async () => {
			const formData = ref({ displayName: "Lewis", username: "Ada" });

			const updateFieldValue = vi.fn((name, value) => {
				formData.value[name] = value;
			});

			const wrapper = mountDeep({
				props: { modelValue: "Ada" },
				global: {
					provide: {
						form: { ...provide.form, formData, updateFieldValue },
					},
				},
			});

			await wrapper.setProps({ name: "displayName" });
			await nextTick();

			expect(wrapper.findComponent(FormInput).props("modelValue")).toBe("Lewis");
			expect(updateFieldValue).toHaveBeenCalledTimes(1);
			expect(updateFieldValue).toHaveBeenCalledWith("displayName", "Lewis");
			expect(formData.value).toEqual({ displayName: "Lewis", username: "Ada" });
		});
	});

	describe("Computed", () => {
		describe("fieldType", () => {
			test("should ignore an unknown field type", () => {
				const wrapper = mount({ type: "unknown" });
				const vm = wrapper.vm;

				expect(vm.fieldType).toBe("text");
			});

			describe("should allow a known field type", () => {
				test.for([
					["text", {}],
					["email", {}],
					["password", {}],
					["textarea", {}],
					["checkbox", {}],
					["combo-box", { options: [] }],
					["radio-group", { options: [] }],
					["button-group", { options: [] }],
					["file", {}],
				])("%s", ([type, props]) => {
					const wrapper = mount({ type, ...props });
					const vm = wrapper.vm;

					expect(vm.fieldType).toBe(type);
				});
			});
		});

		describe("unknown type diagnostic", () => {
			test("in development, renders the diagnostic and warns", () => {
				const warning = stubDevelopmentWarning(true);
				const wrapper = mountDeep({ props: { name: "username", type: "unknown" } });

				expect(wrapper.findComponent(FormInput).exists()).toBe(true);
				expect(wrapper.get('[data-test="form-field-unknown-type-error"]').exists()).toBe(true);
				expect(wrapper.text()).toContain("Unknown field type `unknown`. Falling back to `text`.");
				expect(warning).toHaveBeenCalledTimes(1);
				expect(warning).toHaveBeenCalledWith(unknownTypeWarning);
			});

			test("in production, renders neither the diagnostic nor a warning", () => {
				const warning = stubDevelopmentWarning(false);
				const wrapper = mountDeep({ props: { name: "username", type: "unknown" } });

				expect(wrapper.findComponent(FormInput).exists()).toBe(true);
				expect(wrapper.find('[data-test="form-field-unknown-type-error"]').exists()).toBe(false);
				expect(wrapper.text()).not.toContain(
					"Unknown field type `unknown`. Falling back to `text`.",
				);
				expect(warning).not.toHaveBeenCalled();
			});
		});

		describe("fieldComponent", () => {
			test("should ignore an unknown field type", () => {
				const wrapper = mount({ type: "unknown" });
				const vm = wrapper.vm;

				expect(vm.fieldComponent).toBe(FormInput);
			});

			describe("should allow a known field type", () => {
				test.for([
					[{ type: "text" }, FormInput],
					[{ type: "email" }, FormInput],
					[{ type: "password" }, FormInput],
					[{ type: "textarea" }, FormTextarea],
					[{ type: "checkbox" }, FormCheckbox],
					[{ type: "combo-box", options: [] }, FormComboBox],
					[{ type: "radio-group", options: [] }, FormRadioGroup],
					[{ type: "button-group", options: [] }, FormButtonGroup],
					[{ type: "file" }, FormFile],
				])("%s", ([props, component]) => {
					const wrapper = mount({ props });
					const vm = wrapper.vm;

					expect(vm.fieldComponent).toBe(component);
				});
			});
		});

		describe("fieldProps", () => {
			test("should always generate an internal ID", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({ id: expect.any(String), displayLabel: true });
			});

			test("should add props for `email` field type", () => {
				const wrapper = mount({ type: "email" });
				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({
					id: expect.any(String),
					inputAttributes: { type: "email" },
				});
			});

			test("should add props for the `required` prop", () => {
				const wrapper = mount({ required: true });

				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({
					required: true,
					id: expect.any(String),
					displayLabel: true,
				});
			});

			test("should combine type and required props", () => {
				const wrapper = mount({
					type: "email",
					required: true,
				});

				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({
					required: true,
					id: expect.any(String),
					inputAttributes: { type: "email" },
				});
			});

			test("should pass displayLabel to text, select, checkbox, and combo-box fields", () => {
				for (const type of ["checkbox", "combo-box", "select", "text"]) {
					const wrapper = mount({ props: { displayLabel: false, type } });

					expect(wrapper.vm.fieldProps).toEqual(expect.objectContaining({ displayLabel: false }));
				}
			});

			test("should not pass displayLabel to other field types", () => {
				const wrapper = mount({ props: { displayLabel: false, type: "textarea" } });

				expect(wrapper.vm.fieldProps).not.toHaveProperty("displayLabel");
			});

			test("should pass multiple to file fields", () => {
				const wrapper = mount({ type: "file", multiple: true });

				expect(wrapper.vm.fieldProps).toEqual({
					id: expect.any(String),
					multiple: true,
				});
			});

			test("should pass multiple's default to file fields", () => {
				const wrapper = mount({ type: "file" });

				expect(wrapper.vm.fieldProps).toEqual({
					id: expect.any(String),
					multiple: false,
				});
			});

			test("should pass name to group fields", () => {
				const wrapper = mount({ type: "radio-group", options: [], name: "colour" });

				expect(wrapper.vm.fieldProps).toEqual(expect.objectContaining({ name: "colour" }));
			});

			test("should pass name's default to group fields", () => {
				const wrapper = mount({ type: "radio-group", options: [], name: null });

				expect(wrapper.vm.fieldProps).toEqual(expect.objectContaining({ name: null }));
			});

			test("should merge external inputAttributes", () => {
				const wrapper = mount({
					type: "email",
					required: true,
					inputAttributes: { "aria-labelledby": "id-123" },
				});

				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({
					required: true,
					id: expect.any(String),
					inputAttributes: { type: "email", "aria-labelledby": "id-123" },
				});
			});

			test("should add readonly prop when form-wrapper provides readonly", () => {
				const wrapper = mount({
					global: {
						provide: {
							form: {
								fieldErrorsFor: fieldErrorsForMock,
								registerField: registerFieldMock,
								isReadonly: { value: true },
							},
						},
					},
				});

				expect(wrapper.vm.fieldProps).toEqual({
					id: expect.any(String),
					readonly: true,
					displayLabel: true,
				});
			});

			test("should not add readonly prop when form-wrapper does not provide readonly", () => {
				const wrapper = mount();

				expect(wrapper.vm.fieldProps).toEqual({
					id: expect.any(String),
					displayLabel: true,
				});
			});
		});

		describe("file slots", () => {
			test("should forward the remove button label slot", async () => {
				const wrapper = mountDeep({
					props: { type: "file" },
					slots: {
						default: "Supporting document",
						"remove-button-label": ({ files }) => `Clear ${files.length} files`,
					},
				});

				await wrapper.setProps({ modelValue: new File(["content"], "document.pdf") });

				expect(wrapper.find('[data-part="remove"]').text()).toContain("Clear 1 files");
			});
		});

		describe("select slots", () => {
			test("should preserve the field label as the empty option fallback", () => {
				const wrapper = mountDeep({
					props: { options: ["Chocolate"], type: "select" },
					slots: { default: "Favourite flavour" },
				});

				expect(wrapper.get('option[value=""]').text()).toBe("Favourite flavour");
			});

			test("should forward the empty option label slot", () => {
				const wrapper = mountDeep({
					props: { options: ["Chocolate"], type: "select" },
					slots: {
						default: "Favourite flavour",
						"empty-option-label": "Choose a flavour",
					},
				});

				expect(wrapper.get('option[value=""]').text()).toBe("Choose a flavour");
			});
		});

		describe("forwarded slots", () => {
			test("should update forwarded slots when a slot is added after mount", async () => {
				const showPrefix = ref(false);

				const wrapperComponent = defineComponent({
					setup() {
						return () =>
							h(
								FormField,
								{ name: "username" },
								showPrefix.value ? { prefix: () => h("span") } : {},
							);
					},
				});

				const wrapper = createDeepMount(wrapperComponent, { global: { provide } })();
				const formInput = wrapper.findComponent(FormInput);

				expect(formInput.vm.$slots.prefix).toBeUndefined();

				showPrefix.value = true;
				await nextTick();

				expect(formInput.vm.$slots.prefix).toBeTypeOf("function");

				showPrefix.value = false;
				await nextTick();

				expect(formInput.vm.$slots.prefix).toBeUndefined();
			});

			test("should forward option content with selection details", () => {
				const wrapper = mountDeep({
					props: {
						modelValue: "banana",
						name: "flavour",
						options: ["banana"],
						type: "radio-group",
					},
					slots: {
						option: ({ id, name, option, selected }) =>
							h(
								"span",
								{ "data-test": "custom-option" },
								option.value + ":" + selected + ":" + id + ":" + name,
							),
					},
				});

				const option = wrapper.get('[data-test="custom-option"]');

				expect(option.text()).toMatch(/^banana:true:.+:flavour$/);
			});

			test("should forward combo-box option content with selection details", async () => {
				const wrapper = mountDeep({
					props: {
						modelValue: "pilot-42",
						name: "pilot",
						labelKey: "name",
						options: [{ id: "pilot-42", name: "Amelia Earhart" }],
						type: "combo-box",
						valueKey: "id",
					},
					slots: {
						option: ({ option, label, value, highlighted, selected }) =>
							h(
								"span",
								{ "data-test": "custom-combo-box-option" },
								`${option.name}:${label}:${value}:${highlighted}:${selected}`,
							),
					},
				});

				wrapper.findComponent(FormComboBox).vm.openResults();
				await nextTick();

				const option = wrapper.get('[data-test="custom-combo-box-option"]');

				expect(option.text()).toBe("Amelia Earhart:Amelia Earhart:pilot-42:false:true");
			});

			test("should forward description content to checkbox fields", () => {
				const wrapper = mountDeep({
					props: { type: "checkbox" },
					slots: {
						default: "Receive updates",
						description: "Unsubscribe at any time.",
					},
				});

				expect(wrapper.get('[data-test="form-checkbox-description"]').text()).toBe(
					"Unsubscribe at any time.",
				);
			});

			test("should ignore slots the concrete field does not use", () => {
				const wrapper = mountDeep({
					slots: { "unrecognised-slot": "Unused content" },
				});

				expect(wrapper.text()).not.toContain("Unused content");
			});
		});

		describe("fallthrough attributes", () => {
			test("should forward attributes to the concrete field", () => {
				const wrapper = mountDeep({ attrs: { "data-test": "concrete-field" } });

				expect(wrapper.findComponent(FormInput).attributes("data-test")).toBe("concrete-field");
			});
		});

		describe("error slot", () => {
			test("should render wrapper field errors by default", () => {
				const wrapper = mountDeep({
					global: {
						provide: {
							form: {
								fieldErrorsFor: () => ["Enter a different username"],
								registerField: registerFieldMock,
							},
						},
					},
				});

				expect(wrapper.get('[data-test="form-error"]').text()).toContain(
					"Enter a different username",
				);
			});

			test("should allow a consumer error slot to override wrapper field errors", () => {
				const wrapper = mountDeep({
					global: {
						provide: {
							form: {
								fieldErrorsFor: () => ["Enter a different username"],
								registerField: registerFieldMock,
							},
						},
					},
					slots: {
						error: () => h("span", { "data-test": "custom-error" }, "Choose another username"),
					},
				});

				expect(wrapper.get('[data-test="custom-error"]').text()).toBe("Choose another username");
				expect(wrapper.text()).not.toContain("Enter a different username");
			});
		});

		describe("isRequired", () => {
			test("should be false with no required prop or cascade", () => {
				const wrapper = mount();

				expect(wrapper.vm.isRequired).toBe(false);
			});

			test("should be true from the `required` prop", () => {
				const wrapper = mount({ required: true });

				expect(wrapper.vm.isRequired).toBe(true);
			});

			test("should be true when form-wrapper cascades a required rule", () => {
				const wrapper = mount({
					global: {
						provide: {
							form: {
								fieldErrorsFor: fieldErrorsForMock,
								registerField: registerFieldMock,
								isFieldRequired: (name) => name === "username",
							},
						},
					},
				});

				expect(wrapper.vm.isRequired).toBe(true);
			});

			test("should be false when the form-wrapper cascade does not match", () => {
				const wrapper = mount({
					global: {
						provide: {
							form: {
								fieldErrorsFor: fieldErrorsForMock,
								registerField: registerFieldMock,
								isFieldRequired: () => false,
							},
						},
					},
				});

				expect(wrapper.vm.isRequired).toBe(false);
			});
		});

		describe("haveParentForm", () => {
			test("should be true if a parent form exists", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.haveParentForm).toBe(true);
			});

			test("should be false if a field is used in isolation", () => {
				const wrapper = mount({ global: { provide: { form: { registerField: null } } } });
				const vm = wrapper.vm;

				expect(vm.haveParentForm).toBe(false);
			});
		});

		describe("haveNameIfRequired", () => {
			test("should be false if a parent form is detected but no name is provided", () => {
				const wrapper = mount({ name: null });
				const vm = wrapper.vm;

				expect(vm.haveNameIfRequired).toBe(false);
			});

			test("should be true if a parent form is detected and a name is provided", () => {
				const wrapper = mount({ name: "username" });
				const vm = wrapper.vm;

				expect(vm.haveNameIfRequired).toBe(true);
			});

			test("should be true if no parent form is detected", () => {
				const wrapper = mount({ global: { provide: { form: { registerField: null } } } });
				const vm = wrapper.vm;

				expect(vm.haveNameIfRequired).toBe(true);
			});
		});

		describe("missing name handling", () => {
			test("registers and updates the parent form normally when a name is provided", async () => {
				const wrapper = mount({ props: { modelValue: "initial" } });

				await wrapper.setProps({ modelValue: "updated" });

				expect(updateFieldValueMock).toHaveBeenCalledTimes(1);
				expect(updateFieldValueMock).toHaveBeenCalledWith("username", "updated");
			});

			test("in development, renders the diagnostic and warns without registering or writing", async () => {
				const warning = stubDevelopmentWarning(true);
				const wrapper = mountDeep({ props: { modelValue: "initial", name: null } });

				await wrapper.setProps({ modelValue: "updated" });

				expect(wrapper.findComponent(FormInput).exists()).toBe(true);
				expect(wrapper.get('[data-test="form-field-missing-name-error"]').exists()).toBe(true);

				expect(wrapper.text()).toContain(
					"A parent `form-wrapper` was detected, but no `name` was provided for this field.",
				);

				expect(warning).toHaveBeenCalledTimes(1);
				expect(warning).toHaveBeenCalledWith(missingNameWarning);
				expect(registerFieldMock).not.toHaveBeenCalled();
				expect(updateFieldValueMock).not.toHaveBeenCalled();
			});

			test("in production, renders without a diagnostic, warning, registering, or writing", async () => {
				const warning = stubDevelopmentWarning(false);
				const wrapper = mountDeep({ props: { modelValue: "initial", name: null } });

				await wrapper.setProps({ modelValue: "updated" });

				expect(wrapper.findComponent(FormInput).exists()).toBe(true);
				expect(wrapper.find('[data-test="form-field-missing-name-error"]').exists()).toBe(false);

				expect(wrapper.text()).not.toContain(
					"A parent `form-wrapper` was detected, but no `name` was provided for this field.",
				);

				expect(warning).not.toHaveBeenCalled();
				expect(registerFieldMock).not.toHaveBeenCalled();
				expect(updateFieldValueMock).not.toHaveBeenCalled();
			});
		});

		describe("fieldMessages", () => {
			test("should include field errors from the form wrapper", () => {
				const wrapper = mount({
					global: {
						provide: {
							form: {
								fieldErrorsFor: () => ["Enter a different username"],
								registerField: registerFieldMock,
							},
						},
					},
				});

				const vm = wrapper.vm;

				expect(vm.fieldMessages).toEqual(["Enter a different username"]);
			});

			test("should return an empty array when used outside form-wrapper", () => {
				const wrapper = mount({
					global: { provide: { form: {} } },
				});

				const vm = wrapper.vm;

				expect(vm.fieldMessages).toEqual([]);
			});
		});
	});
});
