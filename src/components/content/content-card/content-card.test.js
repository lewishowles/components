import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";

import ContentCard from "./content-card.vue";

const defaultOptions = {
	slots: {
		default: "Card content",
		title: "Card title",
	},
};

const mount = createMount(ContentCard, defaultOptions);

describe("content-card", () => {
	describe("Initialisation", () => {
		test("Exists as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Computed", () => {
		test("Detects optional header and footer slots", () => {
			const wrapper = mount({
				slots: {
					default: "Card content",
					footer: "Card footer",
					"header-additional": "Card actions",
					icon: "<span>Icon</span>",
					title: "Card title",
				},
			});

			const vm = wrapper.vm;

			expect(vm.haveDefault).toBe(true);
			expect(vm.haveFooter).toBe(true);
			expect(vm.haveHeader).toBe(true);
			expect(vm.haveHeaderAdditional).toBe(true);
			expect(vm.haveIcon).toBe(true);
			expect(vm.haveTitle).toBe(true);
		});

		test("Detects a custom header slot", () => {
			const wrapper = mount({
				slots: {
					default: "Card content",
					header: "Custom header",
					title: "Card title",
				},
			});

			const vm = wrapper.vm;

			expect(vm.haveCustomHeader).toBe(true);
			expect(vm.haveHeader).toBe(true);
		});

		test("Has base structural footer classes by default", () => {
			const wrapper = mount({
				slots: {
					default: "Card content",
					footer: "Card footer",
				},
			});

			expect(wrapper.vm.resolvedFooterClasses).toContain("rounded-b-xl");
			expect(wrapper.vm.resolvedFooterClasses).toContain("px-6");
			expect(wrapper.vm.resolvedFooterClasses).not.toContain("bg-grey-50");
		});

		test("Merges footerClasses on top of base styles", () => {
			const wrapper = mount({
				props: {
					footerClasses: "bg-grey-50",
				},
				slots: {
					default: "Card content",
					footer: "Card footer",
				},
			});

			expect(wrapper.vm.resolvedFooterClasses).toContain("bg-grey-50");
			expect(wrapper.vm.resolvedFooterClasses).toContain("rounded-b-xl");
		});

		test("Applies collapsed border classes between sections", () => {
			const wrapper = mount({
				slots: {
					default: "Card content",
					footer: "Card footer",
					title: "Card title",
				},
			});

			const vm = wrapper.vm;

			expect(vm.bodyClasses).toContainEqual({
				"border-b-0": true,
				"border-t-0": true,
				"rounded-b-xl": false,
				"rounded-t-xl": false,
			});
		});
	});
});
