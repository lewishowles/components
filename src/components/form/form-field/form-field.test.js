import { createMount } from "@unit/support/mount";
import { describe, expect, test, vi } from "vitest";
import FormField from "./form-field.vue";

const registerFieldMock = vi.fn();
const defaultProps = { name: "username" };
const provide = { "form-wrapper": { registerField: registerFieldMock } };
const mount = createMount(FormField, { props: defaultProps, global: { provide } });

describe("form-field", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("should register with a parent `form-wrapper`", () => {
			mount();

			expect(registerFieldMock).toHaveBeenCalled();
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

				expect(vm.fieldComponent).toBe("form-input");
			});

			describe("should allow a known field type", () => {
				test.for([
					[{ type: "text" }, "form-input"],
					[{ type: "email" }, "form-input"],
					[{ type: "password" }, "form-input"],
					[{ type: "textarea" }, "form-textarea"],
					[{ type: "checkbox" }, "form-checkbox"],
					[{ type: "radio-group", options: [] }, "radio-group"],
					[{ type: "button-group", options: [] }, "button-group"],
				])("%s", ([props, component]) => {
					const wrapper = mount({ props });
					const vm = wrapper.vm;

					expect(vm.fieldComponent).toBe(component);
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
				const wrapper = mount( { global: { provide: { "form-wrapper": { registerField: null } } } });
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
				const wrapper = mount( { global: { provide: { "form-wrapper": { registerField: null } } } });
				const vm = wrapper.vm;

				expect(vm.haveNameIfRequired).toBe(true);
			});
		});
	});
});
