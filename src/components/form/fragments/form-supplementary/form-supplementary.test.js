import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormSupplementary from "./form-supplementary.vue";

const defaultProps = { inputId: "id-abc" };
const mount = createMount(FormSupplementary, { props: defaultProps });

describe("form-supplementary", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
