import { createDeepMount, createMount } from "@unit/support/mount";
import { describe, expect, test } from "vite-plus/test";
import DataTableFooter from "./data-table-footer.vue";

const mount = createMount(DataTableFooter);
const deepMount = createDeepMount(DataTableFooter);

describe("data-table-footer", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});

	describe("Selection count", () => {
		test("should be hidden when selection is disabled", () => {
			const wrapper = mount({ enableSelection: false });

			expect(wrapper.find("[data-test=data-table-footer-selection]").exists()).toBe(false);
		});

		test("should be shown when selection is enabled", () => {
			const wrapper = mount({ enableSelection: true, selectedCount: 3 });
			const selection = wrapper.find("[data-test=data-table-footer-selection]");

			expect(selection.exists()).toBe(true);
			expect(selection.text()).toContain("3 rows selected");
		});
	});

	describe("Render contracts", () => {
		test("should allow the no-results message to be customised", () => {
			const wrapper = deepMount({
				props: { haveDataToDisplay: false },
				slots: { "no-results-message": "Nothing here" },
			});

			expect(wrapper.find("[data-test=data-table-no-results]").text()).toContain("Nothing here");
		});
	});
});
