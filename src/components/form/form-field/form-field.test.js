import { createDeepMount, createMount } from "@lewishowles/testing/vue";
import { describe, expect, test, vi } from "vite-plus/test";
import { h } from "vue";

import FormButtonGroup from "@/components/form/form-button-group/form-button-group.vue";
import FormCheckbox from "@/components/form/form-checkbox/form-checkbox.vue";
import FormField from "./form-field.vue";
import FormFile from "@/components/form/form-file/form-file.vue";
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
					["button-group", { options: [] }],
					["file", {}],
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

			test("should add props for the `required` prop", () => {
				const wrapper = mount({ required: true });

				const vm = wrapper.vm;

				expect(vm.fieldProps).toEqual({
					required: true,
					id: expect.any(String),
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

			test("should pass displayLabel to text, select, and checkbox fields", () => {
				for (const type of ["checkbox", "select", "text"]) {
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
							"form-wrapper": {
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
							"form-wrapper": {
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
});
