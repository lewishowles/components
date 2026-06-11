import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vite-plus/test";

import ButtonGroup from "@/components/form/button-group/button-group.vue";
import FormCheckbox from "@/components/form/form-checkbox/form-checkbox.vue";
import FormField from "./form-field.vue";
import FormInput from "@/components/form/form-input/form-input.vue";
import FormRadioGroup from "@/components/form/form-radio-group/form-radio-group.vue";
import FormTextarea from "@/components/form/form-textarea/form-textarea.vue";

const getFieldErrorsMock = vi.fn(() => []);
const registerFieldMock = vi.fn();
const defaultProps = { name: "username" };

const provide = {
	"form-wrapper": { getFieldErrors: getFieldErrorsMock, registerField: registerFieldMock },
};

const mount = createMount(FormField, { props: defaultProps, global: { provide } });

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
			mount({ type: "date" });

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
					["button-group", { options: [] }],
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
					[{ type: "button-group", options: [] }, ButtonGroup],
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
					inputAttributes: { required: true },
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
					inputAttributes: { required: true, type: "email" },
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
					inputAttributes: { required: true, type: "email", "aria-labelledby": "id-123" },
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
					inputAttributes: { required: true },
				});
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
			test("should include parent-owned field errors from the form wrapper", () => {
				const wrapper = mount({
					global: {
						provide: {
							"form-wrapper": {
								getFieldErrors: () => ["Enter a different username"],
								registerField: registerFieldMock,
							},
						},
					},
				});

				const vm = wrapper.vm;

				expect(vm.fieldMessages).toEqual(["Enter a different username"]);
			});
		});
	});

	describe("Methods", () => {
		describe("validateField", () => {
			test("should pass if no validation is provided", () => {
				const wrapper = mount();
				const vm = wrapper.vm;

				expect(vm.validateField()).toBe(true);
			});
		});
	});
});
