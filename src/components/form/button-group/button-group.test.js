import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import ButtonGroup from "./button-group.vue";

const defaultProps = { options: ["pineapple", "banana", "coconut"] };
const mount = createMount(ButtonGroup, { props: defaultProps });

describe("button-group", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
