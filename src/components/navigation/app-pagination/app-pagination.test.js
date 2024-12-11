import { createMount } from "@unit/support/mount";
import { describe, expect, test } from "vitest";
import AppPagination from "./app-pagination.vue";

const mount = createMount(AppPagination);

describe("app-pagination", () => {
	describe("Initialisation", () => {
		test("should exist as a Vue component", () => {
			const wrapper = mount();

			expect(wrapper.vm).toBeTypeOf("object");
		});
	});
});
