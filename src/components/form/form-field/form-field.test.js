import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormField from "./form-field.vue";

const mount = createMount(FormField);

describe("form-field", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
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
	});
});
