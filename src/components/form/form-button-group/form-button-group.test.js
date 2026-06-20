import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import ButtonGroup from "./form-button-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(ButtonGroup, { props: defaultProps });

describe("form-button-group", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Props", () => {
		describe("required", () => {
			test("passes required to the radio group", () => {
				const wrapper = mount({ props: { required: true } });

				expect(wrapper.findComponent({ name: "FormRadioGroup" }).props("required")).toBe(true);
			});

			test("does not mark the radio group as required by default", () => {
				const wrapper = mount();

				expect(wrapper.findComponent({ name: "FormRadioGroup" }).props("required")).toBe(false);
			});
		});
	});
});
