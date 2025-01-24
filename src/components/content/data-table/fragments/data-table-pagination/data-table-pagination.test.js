import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import DataTablePagination from "./data-table-pagination.vue";

const mount = createMount(DataTablePagination);

describe("data-table-pagination", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
