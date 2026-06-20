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
});
