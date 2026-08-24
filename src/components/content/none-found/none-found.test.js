import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";
import NoneFound from "./none-found.vue";

const mount = createMount(NoneFound);

describe("none-found", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Rendering", () => {
		test("should render the title when a title slot is provided", () => {
			const wrapper = mount({ slots: { title: "No results" } });

			expect(wrapper.find('[data-test="none-found-title"]').text()).toBe("No results");
		});

		test("should omit the title when no title slot is provided", () => {
			const wrapper = mount();

			expect(wrapper.find('[data-test="none-found-title"]').exists()).toBe(false);
		});
	});
});
