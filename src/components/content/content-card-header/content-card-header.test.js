import { createMount } from "@lewishowles/testing/vue";
import { describe, expect, test } from "vite-plus/test";

import ContentCardHeader from "./content-card-header.vue";

const mount = createMount(ContentCardHeader);

describe("content-card-header", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		test("Detects title text in the default slot", () => {
			const wrapper = mount({ slots: { default: "Card title" } });

			expect(wrapper.vm.haveDefault).toBe(true);
			expect(wrapper.vm.haveTitleArea).toBe(true);
		});

		test("Detects icon slot", () => {
			const wrapper = mount({ slots: { icon: "<span>Icon</span>" } });

			expect(wrapper.vm.haveIcon).toBe(true);
			expect(wrapper.vm.haveTitleArea).toBe(true);
		});

		test("Detects header-additional slot", () => {
			const wrapper = mount({ slots: { "header-additional": "Actions" } });

			expect(wrapper.vm.haveHeaderAdditional).toBe(true);
		});

		test("haveTitleArea is false when neither default nor icon slot is provided", () => {
			const wrapper = mount();

			expect(wrapper.vm.haveDefault).toBe(false);
			expect(wrapper.vm.haveIcon).toBe(false);
			expect(wrapper.vm.haveTitleArea).toBe(false);
		});
	});
});
