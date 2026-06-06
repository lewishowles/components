import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import { ref } from "vue";
import DataTableToolbar from "./data-table-toolbar.vue";

const mountWithName = createMount(DataTableToolbar, {
	global: { provide: { "data-table": { haveTableName: ref(true) } } },
});

const mountWithoutName = createMount(DataTableToolbar, {
	global: { provide: { "data-table": { haveTableName: ref(false) } } },
});

describe("data-table-toolbar", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mountWithName();

			expect(wrapper.vm).toBeTypeOf("object");
		});

		test("should expose a triggerSearchFocus method", () => {
			const wrapper = mountWithName();

			expect(wrapper.vm.triggerSearchFocus).toBeTypeOf("function");
		});
	});

	describe("Computed", () => {
		describe("showUserConfiguration", () => {
			test("should be true when a table name is present", () => {
				expect(mountWithName().vm.showUserConfiguration).toBe(true);
			});

			test("should be false when no table name is present", () => {
				expect(mountWithoutName().vm.showUserConfiguration).toBe(false);
			});
		});
	});
});
