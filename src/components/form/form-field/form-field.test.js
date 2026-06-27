import { createMount, createDeepMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";

import FormButtonGroup from "@/components/form/form-button-group/form-button-group.vue";
import FormCheckbox from "@/components/form/form-checkbox/form-checkbox.vue";
import FormField from "./form-field.vue";
import FormInput from "@/components/form/form-input/form-input.vue";
import FormRadioGroup from "@/components/form/form-radio-group/form-radio-group.vue";
import FormTextarea from "@/components/form/form-textarea/form-textarea.vue";

const fieldErrorsForMock = vi.fn(() => []);
const registerFieldMock = vi.fn();
const defaultProps = { name: "username" };

const provide = {
	"form-wrapper": { fieldErrorsFor: fieldErrorsForMock, registerField: registerFieldMock },
};

const mount = createMount(FormField, { props: defaultProps, global: { provide } });
const mountDeep = createDeepMount(FormField, { props: defaultProps, global: { provide } });

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
					["radio-group", { options: [] }],
					["form-button-group", { options: [] }],
				])("%s", ([type, props]) => {
					const wrapper = mount({ type, ...props });
					const vm = wrapper.vm;

					expect(vm.fieldType).toBe(type);
				});
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
					[{ type: "radio-group", options: [] }, FormRadioGroup],
					[{ type: "form-button-group", options: [] }, FormButtonGroup],
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

				expect(vm.fieldProps).toEqual({ id: expect.any(String) });
			});

			test("should add props for `email` field type", () => {
				const wrapper = mount({ type: "email" });
				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({
					id: expect.any(String),
					inputAttributes: { type: "email" },
				});
			});

			test("should add props for `required` validation rule", () => {
				const wrapper = mount({
					validation: [{ rule: "required", message: "Validation message" }],
				});

				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({
					required: true,
					id: expect.any(String),
				});
			});

			test("should combine type and validation props", () => {
				const wrapper = mount({
					type: "email",
					validation: [{ rule: "required", message: "Validation message" }],
				});

				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({
					required: true,
					id: expect.any(String),
					inputAttributes: { type: "email" },
				});
			});

			test("should merge external inputAttributes", () => {
				const wrapper = mount({
					type: "email",
					validation: [{ rule: "required", message: "Validation message" }],
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
							"form-wrapper": {
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
				});
			});

			test("should not add readonly prop when form-wrapper does not provide readonly", () => {
				const wrapper = mount();

				expect(wrapper.vm.fieldProps).toEqual({
					id: expect.any(String),
				});
			});
		});

		describe("propsForValidation", () => {
			test("should not add props if no validation is present", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.propsForValidation).toEqual({});
			});

			test("should add props for `required` rule", () => {
				const wrapper = mount({
					validation: [{ rule: "required", message: "Validation message" }],
				});

				const vm = wrapper.vm;

				expect(vm.propsForValidation).toEqual({
					required: true,
				});
			});

			test("should add props for `required` prop", () => {
				const wrapper = mount({
					required: true,
				});

				const vm = wrapper.vm;

				expect(vm.propsForValidation).toEqual({
					required: true,
				});
			});

			test("should add props when both `required` prop and validation rule are present", () => {
				const wrapper = mount({
					required: true,
					validation: [{ rule: "required", message: "Validation message" }],
				});

				const vm = wrapper.vm;

				expect(vm.propsForValidation).toEqual({
					required: true,
				});
			});

			test("should not add required props when `required` prop is false and no validation rule", () => {
				const wrapper = mount({
					required: false,
				});

				const vm = wrapper.vm;

				expect(vm.propsForValidation).toEqual({});
			});
		});

		describe("haveParentForm", () => {
			test("should be true if a parent form exists", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.haveParentForm).toBe(true);
			});

			test("should be false if a field is used in isolation", () => {
				const wrapper = mount({ global: { provide: { "form-wrapper": { registerField: null } } } });
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
				const wrapper = mount({ global: { provide: { "form-wrapper": { registerField: null } } } });
				const vm = wrapper.vm;

				expect(vm.haveNameIfRequired).toBe(true);
			});
		});

		describe("fieldMessages", () => {
			test("should include field errors from the form wrapper", () => {
				const wrapper = mount({
					global: {
						provide: {
							"form-wrapper": {
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
					global: { provide: { "form-wrapper": {} } },
				});

				const vm = wrapper.vm;

				expect(vm.fieldMessages).toEqual([]);
			});
		});
	});

	describe("Methods", () => {
		describe("validateField", () => {
			test("should pass if no validation is provided", async () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(await vm.validateField()).toBe(true);
			});
		});
	});
});
