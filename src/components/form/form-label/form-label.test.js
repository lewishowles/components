import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import FormLabel from "./form-label.vue";

const defaultProps = { id: "id-abc" };
const mount = createMount(FormLabel, { props: defaultProps });

describe("form-label", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
