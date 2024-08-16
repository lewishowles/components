import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import RadioGroup from "./radio-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(RadioGroup, { props: defaultProps });

describe("radio-group", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
