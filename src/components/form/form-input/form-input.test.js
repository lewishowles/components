import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormInput from "./form-input.vue";

const defaultProps = { id: "id-abc" };
const mount = createMount(FormInput, { props: defaultProps });

describe("form-input", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
