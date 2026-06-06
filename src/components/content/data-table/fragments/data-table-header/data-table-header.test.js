import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import DataTableHeader from "./data-table-header.vue";

const mount = createMount(DataTableHeader);

describe("data-table-header", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Rendering", () => {
		test("should render nothing when no title or introduction is provided", () => {
			const wrapper = mount();

			expect(wrapper.find("[data-test=data-table-header]").exists()).toBe(false);
		});

		test("should render the header when a title is provided", () => {
			const wrapper = mount({ slots: { "table-title": "Movies" } });

			expect(wrapper.find("[data-test=data-table-header]").exists()).toBe(true);
		});

		test("should render the header when an introduction is provided", () => {
			const wrapper = mount({ slots: { "table-introduction": "About the data" } });

			expect(wrapper.find("[data-test=data-table-header]").exists()).toBe(true);
		});
	});

	describe("Computed", () => {
		describe("haveTitle", () => {
			test("should reflect the presence of the title slot", () => {
				expect(mount().vm.haveTitle).toBe(false);
				expect(mount({ slots: { "table-title": "Movies" } }).vm.haveTitle).toBe(true);
			});
		});

		describe("haveIntroduction", () => {
			test("should reflect the presence of the introduction slot", () => {
				expect(mount().vm.haveIntroduction).toBe(false);
				expect(mount({ slots: { "table-introduction": "About" } }).vm.haveIntroduction).toBe(true);
			});
		});
	});
});
