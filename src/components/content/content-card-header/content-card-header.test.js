import { createMount } from "@unit/support/mount";
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
		test("Renders title when title slot is provided", () => {
			const wrapper = mount({ slots: { title: "Card title" } });

			expect(wrapper.vm.haveTitle).toBe(true);
			expect(wrapper.vm.haveTitleArea).toBe(true);
		});

		test("Renders icon when icon slot is provided", () => {
			const wrapper = mount({ slots: { icon: "<span>Icon</span>" } });

			expect(wrapper.vm.haveIcon).toBe(true);
			expect(wrapper.vm.haveTitleArea).toBe(true);
		});

		test("Renders header-additional when provided", () => {
			const wrapper = mount({ slots: { "header-additional": "Actions" } });

			expect(wrapper.vm.haveHeaderAdditional).toBe(true);
		});

		test("haveTitleArea is false when neither title nor icon is provided", () => {
			const wrapper = mount();

			expect(wrapper.vm.haveTitle).toBe(false);
			expect(wrapper.vm.haveIcon).toBe(false);
			expect(wrapper.vm.haveTitleArea).toBe(false);
		});
	});
});
